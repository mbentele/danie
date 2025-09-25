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
  serverExternalPackages: ['@neondatabase/serverless'],
  allowedDevOrigins: process.env.REPLIT_DOMAINS ? [process.env.REPLIT_DOMAINS.split(",")[0]] : ["localhost:5000"],
  // Enable static generation for better performance
  output: 'standalone',
  // Optimize for food blog
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig