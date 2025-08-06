import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // External packages for server components
  serverExternalPackages: ['mongoose'],
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-key',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
