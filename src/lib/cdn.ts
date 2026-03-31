const CDN_ORIGIN =
  process.env.NEXT_PUBLIC_CDN_URL ?? "https://cdn.aifortunedoctor.com";

// In local dev, proxy through Next.js rewrites to avoid CORS / ORB blocking.
export const CDN_BASE =
  process.env.NODE_ENV === "development" ? "/cdn-proxy" : CDN_ORIGIN;

const IMAGE_PREFIX = "web/live/current/images";

export function cdnUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // uploads/ paths are served directly from CDN root; all others need the image prefix.
  if (!path.startsWith("uploads/")) {
    return `${CDN_BASE}/${IMAGE_PREFIX}/${path}`;
  }
  return `${CDN_BASE}/${path}`;
}
