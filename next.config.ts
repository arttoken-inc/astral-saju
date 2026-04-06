import type { NextConfig } from "next";
// Cloudflare dev 바인딩 (workerd) — glibc 2.35+ 필요
// WSL2/Ubuntu 20.04에서는 glibc 2.31이라 workerd 실행 불가
// KV 등 CF 바인딩이 필요한 경우에만 ENABLE_CF_DEV=1로 활성화
if (process.env.NODE_ENV === "development" && process.env.ENABLE_CF_DEV) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
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
        destination: "https://pub-591262c36896460c9feb02c0ef3769dc.r2.dev/:path*",
      },
    ];
  },
};

export default nextConfig;
