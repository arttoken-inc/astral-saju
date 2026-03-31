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

  // Fallback: import from bundled data.
  // landing.ts stores relative CDN paths; components apply cdnUrl() at render time.
  const landing = await import("@/data/landing");

  return {
    carouselSlides: landing.carouselSlides,
    bestCards: landing.bestCards,
    fortuneCards: landing.fortuneCards,
    dreamPosts: landing.dreamPosts,
    celebrities: landing.celebrities,
    assets: {
      replayMobileImg: landing.replayMobileImg,
      replayPcImg: landing.replayPcImg,
      promoVideoSrc: landing.promoVideoSrc,
    },
  };
}
