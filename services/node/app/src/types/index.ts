export interface SelfUser {
  id: number;
  username: string;
  email: string;
  icon: string;
  confirmed_email: boolean;
  banned: boolean;
  documents_made: number;
  flags: number;
  discord_id: string | null;
  github_oauth: string | null;
  api_token: string;
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
  username: string;
  icon: string;
  memberPlus: boolean;
}

export interface Document {
  id: string;
  content: string;
  creator: string | null;
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
    imageEmbed: boolean;
    instantDelete: boolean;
    encrypted: boolean;
    password: null | string;
    public: boolean;
    editors: string[];
  };
}
