import type {
  ServiceConfig,
  ServiceScript,
  LoadedServiceConfig,
} from "@/lib/serviceConfig";

// ---------------------------------------------------------------------------
// R2 helper
// ---------------------------------------------------------------------------

async function getR2(): Promise<R2Bucket | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    return (env as { R2: R2Bucket }).R2;
  } catch {
    return null;
  }
}

async function loadJsonFromR2<T>(r2: R2Bucket, key: string): Promise<T | null> {
  const obj = await r2.get(key);
  if (!obj) return null;
  return (await obj.json()) as T;
}

// ---------------------------------------------------------------------------
// Service config loader (new structure: services/{id}/service.json + script.json)
// ---------------------------------------------------------------------------

/**
 * Load service config + script from R2, falling back to bundled JSON.
 */
export async function loadServiceConfig(
  serviceId: string,
): Promise<LoadedServiceConfig> {
  // Try R2 first
  const r2 = await getR2();
  if (r2) {
    const [service, script] = await Promise.all([
      loadJsonFromR2<ServiceConfig>(r2, `config/services/${serviceId}/service.json`),
      loadJsonFromR2<ServiceScript>(r2, `config/services/${serviceId}/script.json`),
    ]);
    if (service && script) {
      return { service, script };
    }
  }

  // Fallback to bundled JSON (new directory structure)
  try {
    const [serviceMod, scriptMod] = await Promise.all([
      import(`@/data/services/${serviceId}/service.json`),
      import(`@/data/services/${serviceId}/script.json`),
    ]);
    return {
      service: (serviceMod.default ?? serviceMod) as ServiceConfig,
      script: (scriptMod.default ?? scriptMod) as ServiceScript,
    };
  } catch {
    throw new Error(`Service not found: ${serviceId}`);
  }
}

// ---------------------------------------------------------------------------
// Resolve image path with service prefix
// ---------------------------------------------------------------------------

/**
 * Resolve a relative image path to a full CDN path.
 * Paths in service.json are relative to s/{serviceId}/.
 * Paths starting with "shared/", "components/", "decorations/" are kept as-is.
 */
export function resolveServiceImagePath(
  serviceId: string,
  path: string,
): string {
  if (!path) return path;
  // Already absolute (http/https) or uses a shared prefix
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("shared/") ||
    path.startsWith("components/") ||
    path.startsWith("decorations/")
  ) {
    return path;
  }
  return `s/${serviceId}/${path}`;
}

// ---------------------------------------------------------------------------
// Landing config (unchanged)
// ---------------------------------------------------------------------------

export type {
  CarouselSlide,
  RecommendCard,
  CategoryCard,
  CategorySection,
  SnackCard,
  CelebrityPost,
  DreamPost,
} from "@/data/landing";

import type {
  CarouselSlide,
  RecommendCard,
  CategorySection,
  SnackCard,
  CelebrityPost,
  DreamPost,
} from "@/data/landing";

export interface LandingConfig {
  carouselSlides: CarouselSlide[];
  recommendCards: RecommendCard[];
  categorySections: CategorySection[];
  snackCards: SnackCard[];
  celebrities: CelebrityPost[];
  dreamPosts: DreamPost[];
  promoVideoSrc: string;
}

/**
 * Load service thumbnails for a given serviceId.
 * Returns resolved CDN paths (with s/{serviceId}/ prefix).
 */
async function loadServiceThumbnails(
  serviceId: string,
  r2: R2Bucket | null,
): Promise<{ banner?: string; card?: string; rankBadge?: string } | null> {
  // Try R2 first
  if (r2) {
    const obj = await r2.get(`config/services/${serviceId}/service.json`);
    if (obj) {
      try {
        const svc = (await obj.json()) as ServiceConfig;
        if (svc.meta?.thumbnails) {
          return resolveThumbnailPaths(serviceId, svc.meta.thumbnails);
        }
      } catch { /* ignore */ }
    }
  }

  // Fallback to bundled
  try {
    const mod = await import(`@/data/services/${serviceId}/service.json`);
    const svc = (mod.default ?? mod) as ServiceConfig;
    if (svc.meta?.thumbnails) {
      return resolveThumbnailPaths(serviceId, svc.meta.thumbnails);
    }
  } catch { /* service not found */ }

  return null;
}

function resolveThumbnailPaths(
  serviceId: string,
  thumbnails: { banner?: string; card?: string; rankBadge?: string },
): { banner?: string; card?: string; rankBadge?: string } {
  const resolve = (p?: string) =>
    p ? resolveServiceImagePath(serviceId, p) : undefined;
  return {
    banner: resolve(thumbnails.banner),
    card: resolve(thumbnails.card),
    rankBadge: resolve(thumbnails.rankBadge),
  };
}

/**
 * Enrich landing config by resolving serviceId references to actual thumbnail paths.
 */
async function resolveServiceThumbnails(
  config: LandingConfig,
  r2: R2Bucket | null,
): Promise<LandingConfig> {
  // Collect unique serviceIds
  const serviceIds = new Set<string>();
  for (const slide of config.carouselSlides) {
    if (slide.serviceId) serviceIds.add(slide.serviceId);
  }
  for (const card of config.recommendCards) {
    if (card.serviceId) serviceIds.add(card.serviceId);
  }
  for (const section of config.categorySections) {
    for (const card of section.cards) {
      if (card.serviceId) serviceIds.add(card.serviceId);
    }
  }

  if (serviceIds.size === 0) return config;

  // Load all thumbnails in parallel
  const thumbMap = new Map<string, { banner?: string; card?: string; rankBadge?: string }>();
  const entries = Array.from(serviceIds);
  const results = await Promise.all(
    entries.map((id) => loadServiceThumbnails(id, r2)),
  );
  entries.forEach((id, i) => {
    if (results[i]) thumbMap.set(id, results[i]!);
  });

  // Resolve carousel slides
  const carouselSlides = config.carouselSlides.map((slide) => {
    if (!slide.serviceId) return slide;
    const thumb = thumbMap.get(slide.serviceId);
    if (!thumb) return slide;
    return {
      ...slide,
      banner: thumb.banner || slide.banner,
      rankBadge: thumb.rankBadge || slide.rankBadge,
    };
  });

  // Resolve recommend cards
  const recommendCards = config.recommendCards.map((card) => {
    if (!card.serviceId) return card;
    const thumb = thumbMap.get(card.serviceId);
    return { ...card, img: thumb?.card || card.img };
  });

  // Resolve category cards
  const categorySections = config.categorySections.map((section) => ({
    ...section,
    cards: section.cards.map((card) => {
      if (!card.serviceId) return card;
      const thumb = thumbMap.get(card.serviceId);
      return { ...card, img: thumb?.card || card.img };
    }),
  }));

  return {
    ...config,
    carouselSlides,
    recommendCards,
    categorySections,
  };
}

export async function loadLandingConfig(): Promise<LandingConfig> {
  const r2 = await getR2();

  let config: LandingConfig;

  if (r2) {
    const fromR2 = await loadJsonFromR2<LandingConfig>(r2, "config/landing.json");
    if (fromR2) {
      config = fromR2;
    } else {
      const landing = await import("@/data/landing");
      config = {
        carouselSlides: landing.carouselSlides,
        recommendCards: landing.recommendCards,
        categorySections: landing.categorySections,
        snackCards: landing.snackCards,
        celebrities: landing.celebrities,
        dreamPosts: landing.dreamPosts,
        promoVideoSrc: landing.promoVideoSrc,
      };
    }
  } else {
    const landing = await import("@/data/landing");
    config = {
      carouselSlides: landing.carouselSlides,
      recommendCards: landing.recommendCards,
      categorySections: landing.categorySections,
      snackCards: landing.snackCards,
      celebrities: landing.celebrities,
      dreamPosts: landing.dreamPosts,
      promoVideoSrc: landing.promoVideoSrc,
    };
  }

  // Resolve service thumbnails
  return resolveServiceThumbnails(config, r2);
}
