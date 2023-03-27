import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { DiscordUser, Document, GitHubUser, UserSettings } from "../types";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("name").notNull(),
  email: text("email").notNull(),
  icon: text("icon"),
  confirmedEmailed: boolean("confirmed_email").default(false),
  password: text("password").notNull(),
  documentsMade: integer("documents_made").default(0),
  APIToken: text("api_token").notNull(),
  banned: boolean("banned").default(false),
  flags: integer("flags").default(0),
  settings: json("settings").$type<UserSettings>(),
  github: json("github").$type<GitHubUser>(),
  discord: json("discord").$type<DiscordUser>(),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  gistURL: text("gist_url"),
  creator: integer("creator").references(() => users.id),
  views: integer("views").default(0),
  createdAt: text("created_at").default(""),
  expiresAt: text("expires_at"),
  settings: json("settings").$type<
    Omit<Document["settings"], "editors"> & { editors: string[] }
  >(),
});
