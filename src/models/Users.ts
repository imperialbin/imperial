import { Document, model, Schema } from "mongoose";

export interface UserSettings {
  clipboard: boolean;
  longerUrls: boolean;
  instantDelete: boolean;
  encrypted: boolean;
  time: number;
  imageEmbed: boolean;
}
export interface IUser extends Document {
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
  settings: UserSettings;
}

const UserSchema = new Schema({
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
  settings: {
    clipboard: Boolean,
    longerUrls: Boolean,
    instantDelete: Boolean,
    encrypted: Boolean,
    time: Number,
    imageEmbed: Boolean,
  },
});

export const Users = model<IUser>("Users", UserSchema);
