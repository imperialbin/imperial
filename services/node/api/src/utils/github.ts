import { GitHubUserResponse } from "../types";
import { env } from "./env";

type GitHubAccessTokenResponse =
  | {
      access_token: string;
      scope: string;
      token_type: string;
    }
  | {
      error: string;
      error_description: string;
      error_uri: string;
    };

export class GitHub {
  public static async getAccessToken(code: string) {
    const accessTokenRequest = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    )
      .then((res) => res.json() as unknown as GitHubAccessTokenResponse)
      .catch(() => ({
        error: "Internal server error",
        error_description: "Internal server error",
        error_uri: "Internal server error",
      }));

    return accessTokenRequest;
  }

  public static async getUserWithToken(userAuth: string) {
    const userInfo = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${userAuth}`,
      },
    })
      .then((res) => res.json() as unknown as GitHubUserResponse)
      .catch(() => null);

    return userInfo;
  }

  public static async createGist(
    content: string,
    documentId: string,
    userAuth: string,
    language?: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const gist = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${userAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          [`${documentId}`]: {
            content,
          },
        },
      }),
    }).then(async (res) => res.json());

    return gist as string;
  }
}
