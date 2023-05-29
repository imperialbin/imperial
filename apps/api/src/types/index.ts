import {
  DiscordUser,
  Document,
  GitHubUser,
  SelfUser,
  User,
  UserSettings,
} from "@imperial/commons";
import { InferModel } from "drizzle-orm";
import { FastifyReply, FastifyRequest, RequestGenericInterface } from "fastify";
import { users } from "../db/schemas";
import { z } from "zod";

const ERROR = {
  UNAUTHORIZED: "unauthorized",
  BAD_AUTH: "bad_auth",
  NOT_FOUND: "not_found",
  BAD_REQUEST: "bad_request",
  INTERNAL_ERROR: "internal_error",
  NOT_IMPLEMENTED: "not_implemented",
} as const;

type APIError = {
  code: (typeof ERROR)[keyof typeof ERROR];
  message: string;
  errors?: z.ZodIssue[];
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

type GetRequestType<T extends (...args: any[]) => any> = Parameters<T>[0];
type RP<T extends (...args: any[]) => any> = {
  Body: GetRequestType<T>["body"];
  Querystring: GetRequestType<T>["query"];
  Params: GetRequestType<T>["params"];
  Headers: GetRequestType<T>["headers"];
};

type FastifyImp<
  RouteGeneric extends RequestGenericInterface = RequestGenericInterface,
  K = unknown,
  V extends boolean | undefined = undefined,
> = (
  req: Omit<FastifyRequest<RouteGeneric>, "user"> & {
    user: V extends undefined
      ? InferModel<typeof users> | null
      : V extends true
      ? InferModel<typeof users>
      : null;
  },
  res: Omit<FastifyReply, "send" | "status"> & {
    send(data: ImperialResponse<K>): FastifyReply;
    status(code: number): Omit<FastifyReply, "send" | "status"> & {
      send(data?: ImperialResponse<K>): FastifyReply;
    };
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
  GetRequestType,
  RP,
};

export { ERROR };
