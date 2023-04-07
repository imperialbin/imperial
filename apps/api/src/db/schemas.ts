import { boolean, integer, json, pgTable, text } from "drizzle-orm/pg-core";
import { DiscordUser, GitHubUser, UserSettings, Id } from "@imperial/commons";

export const users = pgTable("users", {
  id: text("id").primaryKey().$type<Id<"user">>(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  icon: text("icon"),
  confirmed: boolean("confirmed").notNull().default(false),
  early_adopter: boolean("early_adopter").notNull().default(false),
  password: text("password").notNull(),
  documents_made: integer("documents_made").notNull().default(0),
  api_token: text("api_token").notNull(),
  banned: boolean("banned").notNull().default(false),
  flags: integer("flags").notNull().default(0),
  settings: json("settings").$type<UserSettings>().notNull(),
  github: json("github").$type<GitHubUser>(),
  discord: json("discord").$type<DiscordUser>(),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  gist_url: text("gist_url"),
  creator: text("creator")
    .references(() => users.id, { onDelete: "cascade" })
    .$type<Id<"user">>(),
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
      editors: Array<Id<"user">>;
    }>()
    .notNull(),
});

export const devices = pgTable("devices", {
  id: text("id").primaryKey(),
  user: text("user")
    .references(() => users.id, { onDelete: "cascade" })
    .$type<Id<"user">>(),
  user_agent: text("user_agent").notNull(),
  ip: text("ip").notNull(),
  auth_token: text("auth_token").notNull(),
  created_at: text("created_at").notNull(),
});

export const memberPlusTokens = pgTable("member_plus_tokens", {
  id: text("id").primaryKey().$type<Id<"member_plus">>(),
});
