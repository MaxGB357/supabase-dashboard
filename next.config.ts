import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict Content Security Policy for development
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
