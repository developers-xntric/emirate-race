import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/poetry",
          destination: "/poetry/index.html",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/races/al-lehbab",
        destination: "/races/lahbab",
        permanent: true,
      },
      {
        source: "/races/lehbab",
        destination: "/races/lahbab",
        permanent: true,
      },
    ];
  },
  images: {
    // WebP has broad browser support and avoids AVIF's slower first-request encoding.
    formats: ["image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [100, 75, 90],
  },
  async headers() {
    const mediaCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=2592000, stale-while-revalidate=31536000",
      },
    ];

    return [
      "/fonts/:path*",
      "/home/:path*",
      "/gallery/:path*",
      "/about/:path*",
      "/contact/:path*",
      "/partners/:path*",
      "/races/:path*",
      "/press-kit/:path*",
      "/favicon.png",
    ].map((source) => ({ source, headers: mediaCacheHeaders }));
  },
};

export default nextConfig;
