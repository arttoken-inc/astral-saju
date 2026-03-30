const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL ?? "";

export function cdnUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${CDN_BASE}/${path}`;
}
