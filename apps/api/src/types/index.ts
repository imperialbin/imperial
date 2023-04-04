import {
  DiscordUser,
  Document,
  GitHubUser,
  SelfUser,
  User,
  UserSettings,
} from "@imperial/commons/types";
import { FastifyReply, FastifyRequest } from "fastify";

type APIError = {
  code: "BRUH";
  message: string;
};

type ImperialResponse<T = unknown> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      error: APIError;
    };

type FastifyImp<T = unknown, B = unknown, Q = unknown, P = unknown> = (
  req: FastifyRequest<{ Body: B; Querystring: Q; Params: P }>,
  res: Omit<FastifyReply, "send"> & {
    send(data: ImperialResponse<T>): FastifyReply;
  },
) => Promise<unknown>;

// Type for Githubs API response
type GitHubUserResponse = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
};

export type {
  APIError,
  SelfUser,
  UserSettings,
  DiscordUser,
  GitHubUser,
  FastifyImp,
  User,
  Document,
  GitHubUserResponse,
};
