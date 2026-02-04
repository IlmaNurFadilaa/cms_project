import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Config gambar yang sudah kamu buat sebelumnya (biarkan saja)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 2. TAMBAHKAN BAGIAN INI UNTUK VIDEO
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // Izinkan upload sampai 500MB
    },
  },
};

export default nextConfig;