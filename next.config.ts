import type { NextConfig } from "next";

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
  // turbopack customizations removed due to type incompatibility
};

export default nextConfig;
