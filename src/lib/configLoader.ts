import type { ServiceConfig } from "@/lib/serviceConfig";

/**
 * Load service config from R2, falling back to bundled JSON.
 * For use in server components / route handlers only.
 */
export async function loadServiceConfig(
  serviceId: string,
): Promise<ServiceConfig> {
  // Try R2 first
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const r2 = (env as { R2: R2Bucket }).R2;
    const obj = await r2.get(`config/services/${serviceId}.json`);
    if (obj) {
      return (await obj.json()) as ServiceConfig;
    }
  } catch {
    // R2 not available (local dev without wrangler), fall through
  }

  // Fallback to bundled JSON
  try {
    const mod = await import(`@/data/services/${serviceId}.json`);
    return (mod.default ?? mod) as ServiceConfig;
  } catch {
    throw new Error(`Service not found: ${serviceId}`);
  }
}

/**
 * Landing config types — matches src/data/landing.ts exports
 */
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
 * Load landing config from R2, falling back to bundled defaults.
 */
export async function loadLandingConfig(): Promise<LandingConfig> {
  // Try R2 first
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const r2 = (env as { R2: R2Bucket }).R2;
    const obj = await r2.get("config/landing.json");
    if (obj) {
      return (await obj.json()) as LandingConfig;
    }
  } catch {
    // R2 not available, fall through
  }

  const landing = await import("@/data/landing");

  return {
    carouselSlides: landing.carouselSlides,
    recommendCards: landing.recommendCards,
    categorySections: landing.categorySections,
    snackCards: landing.snackCards,
    celebrities: landing.celebrities,
    dreamPosts: landing.dreamPosts,
    promoVideoSrc: landing.promoVideoSrc,
  };
}
