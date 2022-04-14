/* ENV and some static stuff */
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost/"
    : "https://staging.impb.in/";
export const API_VERSION_V1 = "v1";
export const FULL_URI_V1 = API_BASE + API_VERSION_V1;

/* Socials */
export const DiscordURL = "https://discord.gg/cTm85eW49D";
export const GitHubURL = "https://github.com/imperialbin";
export const TwitterURL = "https://twitter.com/imperialbin";
