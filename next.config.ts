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
    '/*': [
      'node_modules/.prisma/client/libquery_engine-*',
      'node_modules/@prisma/client/**/*',
    ],
  },
};

export default nextConfig;
