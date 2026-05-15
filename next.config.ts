import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/*': ['./src/generated/prisma/**/*'],
  },
};

export default nextConfig;
