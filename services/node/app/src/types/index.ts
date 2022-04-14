export interface SelfUser {
  id: string;
  userId: number;
  username: string;
  email: string;
  banned: boolean;
  confirmed: boolean;
  icon: string;
  memberPlus: boolean;
  apiToken: string;
  documentsMade: number;
  discordId: string;
  githubAccess: string;
  settings: UserSettings;
}

export interface UserSettings {
  clipboard: boolean;
  longUrls: boolean;
  shortUrls: boolean;
  instantDelete: boolean;
  encrypted: boolean;
  imageEmbed: boolean;
  expiration: number;

  fontLignatures: boolean;
  fontSize: number;
  renderWhitespace: boolean;
  wordWrap: boolean;
  tabSize: number;
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
