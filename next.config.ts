import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Keyword base pages -> cities directory (nationwide landing)
      {
        source: '/rent-a-car',
        destination: '/cities',
      },
      {
        source: '/car-rental',
        destination: '/cities',
      },

      // Keyword + city variants -> core city rental page
      {
        source: '/rent-a-car/:city',
        destination: '/rent-cars/:city',
      },
      {
        source: '/car-rental/:city',
        destination: '/rent-cars/:city',
      },

      // City root alias
      {
        source: '/city/:city',
        destination: '/rent-cars/:city',
      },

      // Vehicle base pages -> search filtered by vehicle type
      {
        source: '/vehicles/:vehicleType',
        destination: '/search?vehicleType=:vehicleType',
      },

      // Vehicle + city pages -> search filtered by vehicle type + city
      {
        source: '/:vehicleType/:city',
        destination: '/search?vehicleType=:vehicleType&city=:city',
      },
      // Airport transfer city pages
      {
        source: '/airport-transfer/:city',
        destination: '/airport-transfer/:city',
      },
    ];
  },
};

export default nextConfig;
