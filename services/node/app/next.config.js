/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "github.com", "gravatar.com"],
  },
  async redirects() {
    return [
      {
        source: "/p/:id*",
        destination: "/:id*",
        permanent: true,
      },
    ];
  },
};
