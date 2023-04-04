import { bool, envsafe, num, str } from "envsafe";

export const env = envsafe({
  PRODUCTION: bool({
    default: false,
    desc: "Whether the website is running in production",
  }),
  API_URL: str({
    default: "http://127.0.0.1:8080/",
    desc: "The api url",
  }),
  API_URL_V1: str({
    default: "http://127.0.0.1:8080/v1",
    desc: "The api url v1",
  }),
  CDN_URL: str({
    default: "https://cdn.impb.in/",
    desc: "The cdn url",
  }),
  DISCORD_INVITE: str({
    default: "https://discord.gg/cTm85eW49D",
    desc: "The discord invite url",
  }),
  GITHUB_URL: str({
    default: "https://github.com/imperialbin",
    desc: "The github url",
  }),
  TWITTER_URL: str({
    default: "https://twitter.com/imperialbin",
    desc: "The twitter url",
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
});
