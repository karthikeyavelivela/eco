/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fix for leaflet which uses browser globals
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
