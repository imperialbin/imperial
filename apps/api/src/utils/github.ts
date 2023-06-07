import crypto from "crypto";
import { GitHubUser, GitHubUserResponse } from "../types";
import { env } from "./env";
import { Logger } from "./logger";

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

type GitHubGistResponse = {
  url: string;
  forks_url: string;
  commits_url: string;
  id: string;
  node_id: string;
  git_pull_url: string;
  git_push_url: string;
  html_url: string;
  files: {
    X82qtY3O: {
      filename: string;
      type: string;
      language: string | null;
      raw_url: string;
      size: number;
      truncated: boolean;
      content: string;
    };
  };
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string | null;
  comments: number;
  user: string | null;
  comments_url: string;
  owner: GitHubUser;
  truncated: boolean;
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
      },
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
  ) {
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
    })
      .then(async (res) => {
        const json = (await res.json()) as Record<string, string>;
        if (!res.ok) {
          throw new Error(json.message ?? "Unknown error");
        }

        return json as unknown as GitHubGistResponse;
      })
      .catch((err) => {
        Logger.error("GitHub", `Error creating Gist ${String(err)}`);
        return null;
      });

    return gist;
  }

  public static async editGist(
    gistURL: string,
    documentId: string,
    newContent: string,
    userAuth: string,
  ) {
    const gistId = gistURL.split("/").at(-1) ?? gistURL;

    const gist = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${userAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          [`${documentId}`]: { content: newContent },
        },
      }),
    })
      .then(async (res) => {
        const json = (await res.json()) as Record<string, string>;
        if (!res.ok) {
          throw new Error(json.message ?? "Unknown error");
        }

        return res as unknown as GitHubGistResponse;
      })
      .catch((err) => {
        Logger.error("GitHub", `Error creating Gist ${String(err)}`);
        return null;
      });

    return gist;
  }

  public static verifySignature(body: unknown, requestSignature: string) {
    const signature = crypto
      .createHmac("sha256", env.GITHUB_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    return `sha256=${signature}` === requestSignature;
  }
}
