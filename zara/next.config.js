/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'libertywear.uz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'libertywear.uz',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'libertywear.uz',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '147.45.155.163',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '147.45.155.163',
        port: '8000',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.libertywear.uz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.libertywear.uz',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'api.libertywear.uz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'api.libertywear.uz',
        pathname: '/api/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
