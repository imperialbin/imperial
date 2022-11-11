import { SupportedLanguages } from "../utils/Constants";

export interface SelfUser {
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

export interface UserSettings {
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

export interface User {
  id: number;
  documents_made: number;
  username: string;
  icon: string;
  flags: 0;
}

export interface Document {
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
    language: SupportedLanguages;
    imageEmbed: boolean;
    instantDelete: boolean;
    encrypted: boolean;
    password: null | string;
    public: boolean;
    editors: User[];
  };
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
