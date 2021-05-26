// Pretty much every env thing
export class Consts {
  /* PORT */
  static PORT = process.env.PORT ?? 3000;

  /* SES */
  static AWS_REGION = process.env.AWS_REGION ?? "";
  static AWS_ACCESS = process.env.AWS_ACCESS ?? "";
  static AWS_SECRET = process.env.AWS_SECRET ?? "";

  /* DATABASES */
  static DOCUMENT_URI = process.env.DOCUMENT_URI ?? "";
  static MONGO_URI = process.env.MONGO_URI ?? "";
  static IMAGE_BUCKET_URI = process.env.IMAGE_BUCKET_URI ?? "";
  static IMAGE_BUCKET_API_KEY = process.env.IMAGE_BUCKET_API_KEY ?? "";
  static IMAGE_BUCKET_API_SECRET = process.env.IMAGE_BUCKET_API_SECRET ?? "";
  static IMAGE_BUCKET_CLOUD_NAME = process.env.IMAGE_BUCKET_CLOUD_NAME ?? "";

  /* URIs for like response sending */
  static MAIN_URI = process.env.MAIN_URI ?? "";
  static DISCORD_CALLBACK_URI = process.env.DISCORD_CALLBACK_URI ?? "";
  static GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI ?? "";

  /* DISCORD ID FOR THE DEVELOPER */
  static DEVELOPER_USER = process.env.DEVELOPER_USER ?? "";

  /* DISCORD STUFF FOR CALLBACKS */
  static DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
  static DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET ?? "";
  static DISCORD_GUILD = process.env.DISCORD_GUILD ?? "";
  static DISCORD_ROLE_MEMBER = process.env.DISCORD_ROLE_MEMBER ?? "";
  static DISCORD_ROLE_MEMBER_PLUS = process.env.DISCORD_ROLE_MEMBER_PLUS ?? "";
  static DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN ?? "";

  /* GITHUB STUFF FOR CALLBACKS */
  static GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
  static GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";

  /* REDIS */
  static REDIS_HOST = process.env.REDIS_HOST ?? "redis://localhost:56379";

  /* SOME SECRETS FOR AUTHORIZATION */
  static COOKIE_SECRET = process.env.COOKIE_SECRET ?? "";
  static SESSION_SECRET = process.env.SESSION_SECRET ?? "";
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "";
  static JWT_SECRET = process.env.JWT_SECRET ?? "kdjg32894hg4t";
}
