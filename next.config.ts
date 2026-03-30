import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
