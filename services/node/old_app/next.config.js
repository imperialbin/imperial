/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "localhost",
      "github.com",
      "gravatar.com",
      "avatars.githubusercontent.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/p/:id*",
        destination: "/:id*",
        permanent: true,
      },
      {
        source: "/link/discord",
        destination:
          process.env.NODE_ENV !== "development"
            ? "https://staging-api.impb.in/v1/oauth/discord"
            : "http://localhost/v1/oauth/discord",
        permanent: true,
      },
    ];
  },
};
