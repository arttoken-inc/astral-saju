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
 * Landing config types
 */
export interface LandingCarouselSlide {
  slug: string;
  href: string;
  alt: string;
  dark: boolean;
}

export interface LandingCard {
  title: string;
  desc: string;
  href: string;
  img: string;
}

export interface LandingDreamPost {
  title: string;
  body: string;
  href: string;
}

export interface LandingCelebrity {
  name: string;
  title: string;
  body: string;
  img: string;
  href: string;
}

export interface LandingConfig {
  carouselSlides: LandingCarouselSlide[];
  bestCards: LandingCard[];
  fortuneCards: LandingCard[];
  dreamPosts: LandingDreamPost[];
  celebrities: LandingCelebrity[];
  assets: {
    replayMobileImg: string;
    replayPcImg: string;
    promoVideoSrc: string;
  };
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

  // Fallback: import from bundled data
  const landing = await import("@/data/landing");
  const { cdnUrl } = await import("@/lib/cdn");

  // Strip cdnUrl wrapper — bundled data already has cdnUrl() applied at import time.
  // We need to extract the relative paths for consistency.
  // Since bundled data uses cdnUrl() which prepends CDN_BASE, and our LandingConfig
  // stores relative paths, we convert back.
  const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL ?? "";
  const stripCdn = (url: string) =>
    CDN_BASE && url.startsWith(CDN_BASE) ? url.slice(CDN_BASE.length + 1) : url;

  return {
    carouselSlides: landing.carouselSlides,
    bestCards: landing.bestCards.map((c) => ({ ...c, img: stripCdn(c.img) })),
    fortuneCards: landing.fortuneCards.map((c) => ({ ...c, img: stripCdn(c.img) })),
    dreamPosts: landing.dreamPosts,
    celebrities: landing.celebrities.map((c) => ({ ...c, img: stripCdn(c.img) })),
    assets: {
      replayMobileImg: stripCdn(landing.replayMobileImg),
      replayPcImg: stripCdn(landing.replayPcImg),
      promoVideoSrc: stripCdn(landing.promoVideoSrc),
    },
  };
}
