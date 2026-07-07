import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats first; Netlify's Next runtime serves optimised images.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
