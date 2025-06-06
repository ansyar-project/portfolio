import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  experimental: {
  },
  // Remove unused dependencies from bundle
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@prisma/client": require.resolve("@prisma/client"),
    };
    return config;
  },
};

export default nextConfig;
