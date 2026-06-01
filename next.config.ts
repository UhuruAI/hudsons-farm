import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // @ts-expect-error nodeMiddleware is a valid experimental flag but missing from types
    nodeMiddleware: true,
  },
};

export default nextConfig;
