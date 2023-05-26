import { z } from "zod";

const env_schema = z.object({
  API_URL_V1: z.string().default("http://127.0.0.1:8080/v1"),
  CDN_URL: z.string().default("https://cdn.impb.in/"),
  DISCORD_INVITE: z.string().default("https://discord.gg/cTm85eW49D"),
  GITHUB_URL: z.string().default("https://github.com/imperialbin"),
  TWITTER_URL: z.string().default("https://twitter.com/imperialbin"),
  SENTRY_DSN: z.string().default(""),
  SENTRY_ENVIRONMENT: z.string().default("Local"),
});

export const env = env_schema.parse({
  API_URL_V1: process.env.NEXT_PUBLIC_API_URL_V1,
  CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  DISCORD_INVITE: process.env.NEXT_PUBLIC_DISCORD_INVITE,
  GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
  TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
});
