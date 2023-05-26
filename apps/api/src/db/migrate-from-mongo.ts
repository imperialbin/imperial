/**
 * Migration scripts to migrate from MongoDB to PostgreSQL
 *
 * Run `yarn migrate-from-mongo`
 */

import { SupportedLanguagesID, permer, pika } from "@imperial/commons";
import mongoose, { Document, Schema } from "mongoose";
import { db, setupDB } from ".";
import { documents, users } from "./schemas";
import { Logger } from "../utils/logger";
import { InferModel } from "drizzle-orm";

const usermongo = process.env.USER_MONGO ?? "";
const documentmongo = process.env.DOCUMENTS_MONGO ?? "";

const migrate = async () => {
  await setupDB();
  const userCount = await migrateUsersFromMongo();
  Logger.info("MONGO", `Migrated ${userCount} users from MongoDB`);
  const documentCount = await migrateDocumentsFromMongo();
  Logger.info("MONGO", `Migrated ${documentCount} documents from MongoDB`);
};

const migrateUsersFromMongo = async () => {
  const usersDB = await mongoose.connect(usermongo);
  const Users = usersDB.model<IUser & Document>(
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
  const newUsers: Array<InferModel<typeof users>> = [];
  for (const mongoUser of usersInMongo) {
    const permlist: ReturnType<(typeof permer)["list"]> = ["member"];

    if (mongoUser.memberPlus) {
      permlist.push("member-plus");
    }

    if (mongoUser.admin) {
      permlist.push("admin");
    }

    newUsers.push({
      id: pika.gen("user"),
      api_token: pika.gen("imperial"),
      email: mongoUser.email,
      username: mongoUser.name,
      password: mongoUser.password,
      icon: mongoUser.icon === "/assets/img/pfp.png" ? null : mongoUser.icon,
      banned: mongoUser.banned,
      confirmed: mongoUser.confirmed,
      documents_made: mongoUser.documentsMade,
      early_adopter: true,
      flags: permer.calculate(permlist),
      discord: null,
      github: null,
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

  const documentsInserted = await db.insert(users).values(newUsers).returning();

  return documentsInserted.length;
};

const migrateDocumentsFromMongo = async () => {
  const documentsDB = await mongoose.connect(documentmongo);

  const Documents = documentsDB.model<IDocument>(
    "Documents",
    new Schema({
      URL: String,
      language: String,
      imageEmbed: Boolean,
      instantDelete: Boolean,
      creator: String,
      code: String,
      dateCreated: Number,
      deleteDate: Number,
      allowedEditors: Array,
      encrypted: Boolean,
      encryptedIv: String,
      public: Boolean,
      gist: String || null,
      views: Number,
    }),
  );

  const documentsInMongo = await Documents.find();
  const newDocuments: Array<InferModel<typeof documents>> = [];
  for (const mongoDocument of documentsInMongo) {
    newDocuments.push({
      id: mongoDocument.URL,
      content: mongoDocument.code,
      created_at: new Date(mongoDocument.dateCreated).toISOString(),
      expires_at: new Date(mongoDocument.deleteDate).toISOString(),
      creator: null,
      gist_url: mongoDocument.gist,
      views: mongoDocument.views,
      settings: {
        public: mongoDocument.public,
        encrypted: mongoDocument.encrypted,
        editors: [],
        language: (mongoDocument.language ??
          "plaintext") as SupportedLanguagesID,
        image_embed: mongoDocument.imageEmbed,
        instant_delete: mongoDocument.instantDelete,
      },
    });
  }

  const documentsInserted = await db
    .insert(documents)
    .values(newDocuments)
    .returning();

  return documentsInserted.length;
};

type IUser = {
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
  codes: string[];
  apiToken: string;
  documentsMade: number;
  activeUnlimitedDocuments: number;
  discordId: string | null;
  githubAccess: string | null;
  admin: boolean;
  opt: string | null;
  settings: {
    clipboard: boolean;
    longerUrls: boolean;
    shortUrls: boolean;
    instantDelete: boolean;
    encrypted: boolean;
    expiration: number;
    imageEmbed: boolean;
  };
};

type IDocument = {
  URL: string;
  language: string | null;
  imageEmbed: boolean;
  instantDelete: boolean;
  creator: string | null;
  code: string;
  dateCreated: number;
  deleteDate: number;
  allowedEditors: string[];
  encrypted: boolean;
  encryptedIv: string | null;
  public: boolean;
  gist: string | null;
  views: number;
};

migrate();
