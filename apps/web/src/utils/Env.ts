import { z } from "zod";

const env_schema = z.object({
  PRODUCTION: z.boolean().default(false),
  API_URL_V1: z.string().default("http://127.0.0.1:8080/v1"),
  CDN_URL: z.string().default("https://cdn.impb.in/"),
  DISCORD_INVITE: z.string().default("https://discord.gg/cTm85eW49D"),
  GITHUB_URL: z.string().default("https://github.com/imperialbin"),
  TWITTER_URL: z.string().default("https://twitter.com/imperialbin"),
  SENTRY_DSN: z.string().default(""),
  SENTRY_ENVIRONMENT: z.string().default(""),
});

export const env = env_schema.parse(process.env);
