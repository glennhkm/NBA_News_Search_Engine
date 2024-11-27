import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.nba.com',
        pathname: '/manage/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
