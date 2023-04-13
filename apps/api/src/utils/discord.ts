import { env } from "./env";
import { DiscordUser } from "../types";

export class Discord {
  public static async getAccessToken(code: string) {
    const accessTokenRequest = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: env.DISCORD_CLIENT_ID,
          client_secret: env.DISCORD_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${env.FRONTEND_URL}/auth/discord`,
          scope: "identify,guilds.join,guilds",
        }),
      },
    )
      .then(
        (res) =>
          res.json() as unknown as
            | {
                error: string;
                error_description: string;
              }
            | {
                access_token: string;
                expires_in: number;
                refresh_token: string;
                scope: string;
                token_type: string;
              },
      )
      .catch(() => ({
        error: "Internal server error",
        error_description: "Internal server error",
      }));

    return accessTokenRequest;
  }

  public static async getUserWithToken(token: string) {
    const userRequest = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json() as unknown as DiscordUser)
      .catch(() => null);

    return userRequest;
  }
}
