/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '213.146.184.75', 'noramu.com.tr'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '213.146.184.75',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'noramu.com.tr',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '213.146.184.75:3000', '213.146.184.75', 'noramu.com.tr', 'www.noramu.com.tr'],
    },
  },
}

module.exports = nextConfig
