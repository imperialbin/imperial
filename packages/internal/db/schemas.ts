import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  date,
} from "drizzle-orm/pg-core";
import {
  DiscordUser,
  GitHubUser,
  UserSettings,
  Id,
  SupportedLanguagesID,
} from "@imperial/commons";
import { relations } from "drizzle-orm";

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

export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
  devices: many(devices),
  themes: many(themes),
}));

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  gist_url: text("gist_url"),
  creator: text("creator")
    .references(() => users.id, { onDelete: "cascade" })
    .$type<Id<"user">>(),
  views: integer("views").notNull().default(0),
  created_at: date("created_at", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  expires_at: date("expires_at", {
    mode: "string",
  }),
  settings: json("settings")
    .$type<{
      language: SupportedLanguagesID;
      image_embed: boolean;
      instant_delete: boolean;
      encrypted: boolean;
      public: boolean;
      editors: Array<Id<"user">>;
    }>()
    .notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  creator: one(users, {
    fields: [documents.creator],
    references: [users.id],
  }),
}));

export const devices = pgTable("devices", {
  id: text("id").primaryKey().$type<Id<"device">>(),
  user: text("user")
    .references(() => users.id, { onDelete: "cascade" })
    .$type<Id<"user">>(),
  user_agent: text("user_agent").notNull(),
  ip: text("ip").notNull(),
  auth_token: text("auth_token").notNull().$type<Id<"imperial_auth">>(),
  created_at: text("created_at").notNull(),
});

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.user],
    references: [users.id],
  }),
}));

export const memberPlusTokens = pgTable("member_plus_tokens", {
  id: text("id").primaryKey().$type<Id<"member_plus">>().notNull(),
  claimed_by: text("claimed_by")
    .references(() => users.id, { onDelete: "cascade" })
    .$type<Id<"user">>(),
});

// design.imperialb.in

export const themes = pgTable("themes", {
  id: text("id").primaryKey().$type<Id<"theme">>().notNull(),
  token: text("token").notNull(),
  description: text("description").notNull(),
  name: text("name").notNull(),
  creator: text("creator")
    .references(() => users.id)
    .$type<Id<"user">>(),
  official: boolean("official").notNull().default(false),
  private: boolean("private").notNull().default(false),
  created_at: date("created_at", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});

export const themesRelations = relations(themes, ({ one }) => ({
  creator: one(users, {
    fields: [themes.creator],
    references: [users.id],
  }),
}));
