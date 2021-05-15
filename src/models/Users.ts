import { Document, Schema } from "mongoose";
import { userDatabase } from "../utilities/connectDatabases";

export interface UserSettings {
  clipboard: boolean;
  longerUrls: boolean;
  shortUrls: boolean;
  instantDelete: boolean;
  encrypted: boolean;
  expiration: number;
  imageEmbed: boolean;
}

export interface IUser {
  _id: string;
  userId: number;
  name: string;
  email: string;
  betaCode: string;
  banned: boolean;
  confirmed: boolean;
  ip: string;
  codesLeft: number;
  icon: string;
  password: string;
  memberPlus: boolean;
  codes: Array<string>;
  apiToken: string;
  documentsMade: number;
  activeUnlimitedDocuments: number;
  discordId: string | null;
  githubAccess: string | null;
  admin: boolean;
  opt: string | null;
  settings: UserSettings;
}

export const Users = userDatabase.model<IUser & Document>(
  "Users",
  new Schema({
    userId: Number,
    name: String,
    email: String,
    betaCode: String,
    banned: Boolean,
    confirmed: Boolean,
    ip: String,
    codesLeft: Number,
    icon: String,
    password: String,
    memberPlus: Boolean,
    codes: Array,
    apiToken: String,
    documentsMade: Number,
    activeUnlimitedDocuments: Number,
    admin: Boolean,
    discordId: String || null,
    githubAccess: String || null,
    opt: String || null,
    settings: {
      clipboard: Boolean,
      longerUrls: Boolean,
      shortUrls: Boolean,
      instantDelete: Boolean,
      encrypted: Boolean,
      expiration: Number,
      imageEmbed: Boolean,
    },
  })
);
