/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  // Enable static generation for better performance
  output: 'standalone',
  // Optimize for food blog
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig