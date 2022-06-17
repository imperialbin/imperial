/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "github.com",
      "gravatar.com",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
