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

interface GitHubGistResponse {
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
}

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
    userAuth: string
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
    })
      .then((res) => res.json() as unknown as GitHubGistResponse)
      .catch((err) => {
        Logger.error("GitHub", "Error creating Gist " + err);
        return null;
      });

    return gist;
  }
}
