import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
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
}

const UserSchema = new Schema({
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
});

export const Users = model<IUser>("Users", UserSchema);
