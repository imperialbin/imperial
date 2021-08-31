import { CSSProperties } from "styled-components";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface NavProps {
  user: User;
  creatingDocument?: boolean;
  editor?: boolean;
}

export interface UserIconProps {
  URL: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
}

export interface RequestError {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface User {
  id: string;
  userId: number;
  username: string;
  email: string;
  banned: boolean;
  confirmed: boolean;
  icon: string;
  memberPlus: boolean;
  documentsMade: number;
  activeUnlimitedDocuments: number;
  discordId: string;
  githubAccess: string;
  opt: string;
  settings: UserSettings;
}

export interface Document {
  id: string;
  content: string;
  creator: string | null;
  views: number;
  links: DocumentLinks;
  timestamps: DocumentTimestamps;
  settings: DocumentSettings;
}

export interface DocumentLinks {
  raw: string;
  formatted: string;
}

export interface DocumentTimestamps {
  creation: number;
  expiration: number;
}

export interface DocumentSettings {
  language: string;
  imageEmbed: boolean;
  instantDelete: boolean;
  encrypted: boolean;
  password: null | string;
  public: boolean;
  editors: string[];
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
}

export interface ThemeForStupidProps {
  theme: Theme;
}
export interface Theme {
  layoutDarkest: string;
  layoutDark: string;
  layoutLittleLessDark: string;
  lightestOfTheBunch: string;

  textLightest: string;
  textLight: string;
}
