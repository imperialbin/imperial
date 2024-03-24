// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup :3 deploy /
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/cTm85eW49D",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/imperialbin/",
        permanent: true,
      },
      {
        source: "/purchase",
        destination: "https://buy.stripe.com/3cscN18YMfg39PO5kk",
        permanent: true,
      },
      {
        source: "/link/discord",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080/v1/oauth/discord"
            : "https://api.imperialb.in/v1/oauth/discord",
        permanent: true,
      },
      {
        source: "/link/github",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080/v1/oauth/github"
            : "https://api.imperialb.in/v1/oauth/github",
        permanent: true,
      },
    ];
  },
  transpilePackages: ["commons"],
};

module.exports = nextConfig;
