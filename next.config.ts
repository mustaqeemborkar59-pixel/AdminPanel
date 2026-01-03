
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sakibtruth.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    // This allows the Next.js dev server to accept requests from the
    // Firebase Studio development environment.
    allowedDevOrigins: [
        "6000-firebase-sheetmaster-woo8-1765951992066.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev"
    ],
  },
};

export default nextConfig;
