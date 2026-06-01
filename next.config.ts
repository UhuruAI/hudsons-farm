import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    nodeMiddleware: true,
  },
};

export default nextConfig;
