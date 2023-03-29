import { FastifyReply, FastifyRequest } from "fastify";
import { Id } from "../utils/pika";

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
  }
) => Promise<unknown>;

type SelfUser = {
  id: Id<"user">;
  username: string;
  email: string;
  icon: string | null;
  confirmed: boolean;
  banned: boolean;
  documents_made: number;
  flags: number;
  api_token: string;
  discord: DiscordUser | null;
  github: GitHubUser | null;
  settings: UserSettings;
};

type UserSettings = {
  clipboard: boolean;
  long_urls: boolean;
  short_urls: boolean;
  instant_delete: boolean;
  encrypted: boolean;
  image_embed: boolean;
  expiration: number | null;
  font_ligatures: boolean;
  font_size: number;
  render_whitespace: boolean;
  word_wrap: boolean;
  tab_size: number;
  create_gist: boolean;
};

type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  avatar_decoration: string | null;
  discriminator: string;
  public_flags: string;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: string | null;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number | null;
};

type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  type: string;
  name: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_gists: number;
  private_gists: number;
  two_factor_authentication: boolean;
};

type User = {
  id: Id<"user">;
  documents_made: number;
  username: string;
  icon: string | null;
  flags: number;
};

type Document = {
  id: string;
  content: string;
  creator: User | null;
  views: number;
  gist_url: string | null;
  links: {
    raw: string;
    formatted: string;
  };
  timestamps: {
    creation: string;
    expiration: string | null;
  };
  settings: {
    language: string;
    image_embed: boolean;
    instant_delete: boolean;
    encrypted: boolean;
    password?: string | undefined;
    public: boolean;
    editors: User[];
  };
};

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
