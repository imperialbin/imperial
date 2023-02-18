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
          process.env.NODE_ENV !== "development"
            ? "http://localhost:8080/v1/oauth/discord"
            : "https://imperial.hop.sh/v1/oauth/discord",
        permanent: true,
      },
      {
        source: "/link/github",
        destination:
          process.env.NODE_ENV !== "development"
            ? "http://localhost:8080/v1/oauth/github"
            : "https://imperial.hop.sh/v1/oauth/github",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
