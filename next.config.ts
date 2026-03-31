import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers에서는 sharp 기반 최적화 불가 — CDN이 이미 최적화된 이미지 제공
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.aifortunedoctor.com",
      },
      {
        protocol: "https",
        hostname: "cheongwoldang.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cdn-proxy/:path*",
        destination: "https://cdn.aifortunedoctor.com/:path*",
      },
    ];
  },
};

export default nextConfig;
