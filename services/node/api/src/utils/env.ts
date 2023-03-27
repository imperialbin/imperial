import { envsafe, num, str } from "envsafe";
import "dotenv/config";

export const env = envsafe({
  PORT: num({
    default: 8080,
    desc: "The port to run the server on",
  }),
  DATABASE_URL: str({
    default: "postgres://imperial:imperial@127.0.0.1:5432/postgres",
    desc: "The database url",
  }),
  REDIS_URL: str({
    default: "redis://127.0.0.1:6379/",
    desc: "The redis url",
  }),
  DISCORD_CLIENT_SECRET: str({
    default: "",
    desc: "The discord client secret",
  }),
  DISCORD_GUILD: str({
    default: "",
    desc: "The discord guild id",
  }),
  DISCORD_CLIENT_ID: str({
    default: "",
    desc: "The discord client id",
  }),
  DISCORD_CALLBACK: str({
    default: "http://localhost:3000/auth/discord",
    desc: "The discord callback url",
  }),
  DISCORD_ROLE_MEMBER: str({
    default: "774213066245931039",
    desc: "The discord member role id",
  }),
  DISCORD_BOT_TOKEN: str({
    default: "",
    desc: "The discord bot token",
  }),
  GITHUB_CLIENT_ID: str({
    default: "",
    desc: "The github client id",
  }),
  GITHUB_CLIENT_SECRET: str({
    default: "",
    desc: "The github client secret",
  }),
  GITHUB_CALLBACK: str({
    default: "http://localhost:3000/auth/github",
    desc: "The github callback url",
  }),
  SENTRY_DSN: str({
    default: "",
    desc: "The sentry dsn",
  }),
  SENTRY_ENVIRONMENT: str({
    default: "Local",
    desc: "The sentry environment",
  }),
  FRONTEND_URL: str({
    default: "http://localhost:3000/",
    desc: "The frontend url",
  }),
  AWS_ACCESS_KEY: str({
    default: "",
    desc: "The aws access key",
  }),
  AWS_SECRET_KEY: str({
    default: "",
    desc: "The aws secret key",
  }),
  AWS_REGION: str({
    default: "us-east-1",
    desc: "The aws region",
  }),
  AWS_SES_FROM: str({
    default: "noreply@imperialb.in",
    desc: "The aws ses from email",
  }),
});
