import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
};

export default config;
