/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  
  // Konfigurasi untuk mengizinkan gambar dari Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'urkeomcmufxmtmkzfach.supabase.co',
        pathname: '/storage/v1/object/public/my-portofolio-pic/**',
      },
    ],
  },
};

export default nextConfig;