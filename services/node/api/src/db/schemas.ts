import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { DiscordUser, GitHubUser, UserSettings } from "../types";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("name").notNull(),
  email: text("email").notNull(),
  icon: text("icon"),
  confirmed: boolean("confirmed").notNull().default(false),
  password: text("password").notNull(),
  documents_made: integer("documents_made").notNull().default(0),
  api_token: text("api_token").notNull(),
  banned: boolean("banned").notNull().default(false),
  flags: integer("flags").notNull().default(0),
  settings: json("settings").$type<UserSettings>(),
  github: json("github").$type<GitHubUser>(),
  discord: json("discord").$type<DiscordUser>(),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  gist_url: text("gist_url"),
  creator: integer("creator").references(() => users.id),
  views: integer("views").notNull().default(0),
  created_at: text("created_at").notNull().default(""),
  expires_at: text("expires_at"),
  settings: json("settings")
    .$type<{
      language: string;
      image_embed: boolean;
      instant_delete: boolean;
      encrypted: boolean;
      public: boolean;
      editors: number[];
    }>()
    .notNull(),
});

export const devices = pgTable("devices", {
  id: text("id").primaryKey(),
  user: integer("user").references(() => users.id),
  user_agent: text("user_agent").notNull(),
  ip: text("ip").notNull(),
  auth_token: text("auth_token").notNull(),
  created_at: text("created_at").notNull(),
});
