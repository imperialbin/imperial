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
            : "http://localhost:8080/v1/oauth/discord",
        permanent: false,
      },
      {
        source: "/link/github",
        destination:
          process.env.NODE_ENV !== "development"
            ? "https://staging-api.impb.in/v1/oauth/github"
            : "http://localhost:8080/v1/oauth/github",
        permanent: false,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/cTm85eW49D",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/imperialbin",
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/imperialbin",
        permanent: true,
      },
    ];
  },
};
