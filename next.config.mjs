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
<<<<<<< HEAD
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
=======
>>>>>>> 53122b335e8391d7bd0eb0c4b41a5c19d36d8759
  // Optimize for food blog
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig