import { env } from "./env";
import { DiscordUser } from "../types";
import { Logger } from "@imperial/commons";

const ROLES = {
  "member-plus": env.DISCORD_ROLE_MEMBER_PLUS,
  contributor: env.DISCORD_ROLE_CONTRIBUTOR,
};

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
          scope: "identify",
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

  public static async setRole(userId: string, role: keyof typeof ROLES) {
    const roleId = ROLES[role];

    const roleRequest = await fetch(
      `https://discord.com/api/guilds/${env.DISCORD_GUILD}/members/${userId}/roles/${roleId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        },
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          const json = (await res.json()) as {
            message: string;
            code: number;
          };
          Logger.error(
            "Discord",
            `Error setting role ${json?.message} ${json?.code}`,
          );
          return false;
        }

        return true;
      })
      .catch((err) => {
        Logger.error("Discord", `Error setting role ${String(err)}`);
        return false;
      });

    return roleRequest;
  }
}
