import { ChangeEventHandler } from "hoist-non-react-statics/node_modules/@types/react";
import { ChangeEvent } from "react";
import { CSSProperties } from "styled-components";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ModalProps {
  title: string;
}
export interface NavProps {
  user: User;
  userLoading?: boolean;
  creatingDocument?: boolean;
  editor?: boolean;
  document?: Document | null;
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
  apiToken: string;
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
  editors: Array<string>;
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

export interface SettingProps extends SwitchProps, DropdownProps {
  title: string;
  description: string;
  type?: "switch" | "dropdown";
}

export interface DropdownProps {
  mode?: "languages" | "expiration";
  onToggle: (e?: ChangeEvent<HTMLSelectElement>) => unknown;
  initialValue?: string | number;
  numberLimit?: number;
  disabled?: boolean;
}

export interface InputProps {
  placeholder: string;
  label: string;
  value?: string;
  icon: JSX.Element;
  secretValue?: boolean;
  iconClick: () => unknown;
  iconDisabled?: boolean;
  iconHoverColor?: string | null;
  hideIconUntilDifferent?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  inputDisabled?: boolean;
  tooltipTitle?: string | undefined;
  type?: string;
}
export interface SwitchProps {
  toggled?: boolean;
  onToggle: (e?: ChangeEvent<HTMLSelectElement>) => unknown;
  disabled?: boolean;
}

export interface DocumentEditor {
  username: string;
  icon: string;
  memberPlus: boolean;
  banned: boolean;
}

export interface Language {
  id: number;
  name: string;
  icon?: React.ReactNode;
  extensions?: Array<string>;
}
