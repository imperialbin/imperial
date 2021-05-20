// Pretty much every env thing
export class Consts {
  
  /* SES */
  static SES_REGION = process.env.SES_REGION;
  static SES_ACCESS = process.env.SES_ACCESS;
  static SES_SECRET = process.env.SES_SECRET;

  /* DATABASES */
  static DOCUMENT_URI = process.env.DOCUMENT_URI;
  static MONGO_URI = process.env.MONGO_URI;
  
  /* URIs for like response sending */
  static MAIN_URI = process.env.MAIN_URI;
  static DISCORD_CALLBACK_URI = process.env.DISCORD_CALLBACK_URI;
  static GITHUB_CALLBACK_URI = process.env.GITHUB_CALLBACK_URI;

  /* DISCORD ID FOR THE DEVELOPER */
  static DEVELOPER_USER = process.env.DEVELOPER_USER;

  /* DISCORD STUFF FOR CALLBACKS */
  static DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  static DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  static DISCORD_GUILD = process.env.DISCORD_GUILD;
  static DISCORD_ROLE_MEMBER = process.env.DISCORD_ROLE_MEMBER;
  static DISCORD_ROLE_MEMBER_PLUS = process.env.DISCORD_ROLE_MEMBER_PLUS;
  static DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  /* GITHUB STUFF FOR CALLBACKS */
  static GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  static GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  /* REDIS */
  static REDIS_HOST = process.env.REDIS_HOST;

  /* SOME SECRETS FOR AUTHORIZATION */
  static COOKIE_SECRET = process.env.COOKIE_SECRET;
  static SESSION_SECRET = process.env.SESSION_SECRET;
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
}
