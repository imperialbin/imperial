import { Id } from "../utils/pika";

type SelfUser = {
  id: Id<"user">;
  username: string;
  email: string;
  icon: string | null;
  confirmed: boolean;
  early_adopter: boolean;
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
  token: string;
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

export type { SelfUser, UserSettings, DiscordUser, GitHubUser, User, Document };
