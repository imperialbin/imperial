import { bool, envsafe, num, str } from "envsafe";
import "dotenv/config";

export const env = envsafe({
  PRODUCTION: bool({
    default: true,
    desc: "Whether the server is running in production",
  }),
  HOST: str({
    default: "localhost",
    desc: "The host to run the server on",
  }),
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
  DISCORD_INVITE: str({
    default: "https://discord.gg/cTm85eW49D",
    desc: "The discord invite url",
  }),
  DISCORD_CLIENT_SECRET: str({
    default: "",
    desc: "The discord client secret",
    allowEmpty: true,
  }),
  DISCORD_GUILD: str({
    default: "",
    desc: "The discord guild id",
    allowEmpty: true,
  }),
  DISCORD_CLIENT_ID: str({
    default: "",
    desc: "The discord client id",
    allowEmpty: true,
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
    allowEmpty: true,
  }),
  GITHUB_CLIENT_ID: str({
    default: "",
    desc: "The github client id",
    allowEmpty: true,
  }),
  GITHUB_CLIENT_SECRET: str({
    default: "",
    desc: "The github client secret",
    allowEmpty: true,
  }),
  GITHUB_CALLBACK: str({
    default: "http://localhost:3000/auth/github",
    desc: "The github callback url",
  }),
  SENTRY_DSN: str({
    default: "",
    desc: "The sentry dsn",
    allowEmpty: true,
  }),
  SENTRY_ENVIRONMENT: str({
    default: "Local",
    desc: "The sentry environment",
  }),
  FRONTEND_URL: str({
    default: "http://localhost:3000",
    desc: "The frontend url",
  }),
  AWS_ACCESS_KEY: str({
    default: "",
    desc: "The aws access key",
    allowEmpty: true,
  }),
  AWS_SECRET_KEY: str({
    default: "",
    desc: "The aws secret key",
    allowEmpty: true,
  }),
  AWS_REGION: str({
    default: "us-east-1",
    desc: "The aws region",
    allowEmpty: true,
  }),
  AWS_SES_FROM: str({
    default: "noreply@imperialb.in",
    desc: "The aws ses from email",
    allowEmpty: true,
  }),
  COOKIE_SIGNER: str({
    default: "imperial",
    desc: "The cookie signer",
  }),
});
