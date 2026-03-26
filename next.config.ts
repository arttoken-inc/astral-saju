import type { NextConfig } from "next";

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
