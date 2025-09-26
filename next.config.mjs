/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.danie.de',
      },
      {
        protocol: 'https',
        hostname: 'danie.de',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  // Optimize for food blog
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Server configuration for Replit
  server: {
    port: 3000,
    hostname: '0.0.0.0',
  },
}

export default nextConfig