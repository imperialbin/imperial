import { permer, pika } from "@imperial/commons";
import mongoose from "mongoose";
const uri = "";

export const migrateFromMongo = async () => {
  const mongo = await mongoose.connect(uri);

  const Users = mongo.model<IUser & Document>(
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
    }),
  );

  const usersInMongo = await Users.find();
  for (const mongoUser of usersInMongo) {
    const permlist = ["member"];

    if (mongoUser.memberPlus) {
      permlist.push("member_plus");
    }
    if (mongoUser.admin) {
      permlist.push("admin");
    }
    await db.insert(users).values({
      id: pika.gen("user"),
      api_token: pika.gen("imperial_auth"),
      email: mongoUser.email,
      username: mongoUser.name,
      password: mongoUser.password,
      icon: mongoUser.icon === "/assets/img/pfp.png" ? null : mongoUser.icon,
      banned: mongoUser.banned,
      confirmed: mongoUser.confirmed,
      documents_made: mongoUser.documentsMade,
      early_adopter: true,
      // @ts-ignore
      flags: permer.calculate(permlist),
      settings: {
        clipboard: mongoUser.settings.clipboard,
        long_urls: mongoUser.settings.longerUrls,
        short_urls: mongoUser.settings.shortUrls,
        word_wrap: false,
        instant_delete: mongoUser.settings.instantDelete,
        encrypted: mongoUser.settings.encrypted,
        expiration: null,
        image_embed: mongoUser.settings.imageEmbed,
        create_gist: false,
        font_size: 14,
        font_ligatures: false,
        tab_size: 2,
        render_whitespace: false,
      },
    });
  }
};

import { Document, Schema } from "mongoose";
import { db } from ".";
import { users } from "./schemas";

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
