/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dzbkzw9bn/**",
      },
    ],
  },
};

module.exports = nextConfig;
