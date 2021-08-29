/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
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
