import { FastifyReply, FastifyRequest } from "fastify";

interface APIError {
  code: "BRUH";
  message: string;
}

type ImperialResponse<T = unknown> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      error: APIError;
    };

type FastifyImp<T = unknown, B = unknown> = (
  req: FastifyRequest<{ Body: B }>,
  res: Omit<FastifyReply, "send"> & {
    send(data: ImperialResponse<T>): FastifyReply;
  }
) => Promise<unknown>;

interface SelfUser {
  id: number;
  username: string;
  email: string;
  icon: string | null;
  confirmed_email: boolean;
  banned: boolean;
  documents_made: number;
  flags: number;
  discord_id: string | null;
  api_token: string;
  discord: DiscordUser | null;
  github: GitHubUser | null;
  settings: UserSettings;
}

interface UserSettings {
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
}

interface DiscordUser {
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
}

interface GitHubUser {
  login: string;
  id: string;
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
}

interface User {
  id: number;
  documents_made: number;
  username: string;
  icon: string;
  flags: 0;
}

interface Document {
  id: string;
  content: string;
  creator: User;
  views: number;
  links: {
    raw: string;
    formatted: string;
  };
  timestamps: {
    creation: number;
    expiration: number;
  };
  settings: {
    language: string;
    image_embed: boolean;
    instant_delete: boolean;
    encrypted: boolean;
    password: null | string;
    public: boolean;
    editors: User[];
  };
}

export {
  APIError,
  SelfUser,
  UserSettings,
  DiscordUser,
  GitHubUser,
  FastifyImp,
  User,
  Document,
};
