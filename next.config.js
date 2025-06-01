/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/proxy',
        destination: 'http://localhost:3000/api/proxy',
      },
    ];
  },
};

module.exports = nextConfig;