/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.staging.clickezy.com',
      },
      {
        protocol: 'https',
        hostname: 'user.staging.clickezy.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.clickezy.in',
      },
    ],
  },
  experimental: {
    forceSwcTransforms: false,
  },
};

module.exports = nextConfig;
