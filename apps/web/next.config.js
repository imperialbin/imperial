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
        source: "/link/discord",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080/v1/oauth/discord"
            : "https://imperial.hop.sh/v1/oauth/discord",
        permanent: true,
      },
      {
        source: "/link/github",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080/v1/oauth/github"
            : "https://imperial.hop.sh/v1/oauth/github",
        permanent: true,
      },
    ];
  },
  env: {
    API_URL_V1: process.env.API_URL_V1,
    CDN_URL: process.env.CDN_URL,
    DISCORD_INVITE: process.env.DISCORD_INVITE,
    GITHUB_URL: process.env.GITHUB_URL,
    TWITTER_URL: process.env.TWITTER_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  },
  transpilePackages: ["commons"],
};

module.exports = nextConfig;

module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourcemaps: true },
);
