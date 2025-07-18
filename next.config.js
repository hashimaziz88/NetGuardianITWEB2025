/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [], // Add domains for external images if needed
  },
};

module.exports = nextConfig;
