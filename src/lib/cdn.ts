const CDN_ORIGIN =
  process.env.NEXT_PUBLIC_CDN_URL ?? "https://pub-591262c36896460c9feb02c0ef3769dc.r2.dev";

// In local dev, proxy through Next.js rewrites to avoid CORS / ORB blocking.
export const CDN_BASE =
  process.env.NODE_ENV === "development" ? "/cdn-proxy" : CDN_ORIGIN;

export function cdnUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${CDN_BASE}/${path}`;
}
