/**
 * Get started really quickly with fake data. (meow rerun flow)
 *
 * Run `yarn seed`
 *
 */

import { uniqueNamesGenerator, names } from "unique-names-generator";
import { db, setupDB } from ".";
import { documents, users } from "./schemas";
import { pika } from "@imperial/commons";
import { exit } from "process";
import { Logger } from "../utils/logger";
import { nanoid } from "nanoid";

const seed = async () => {
  await setupDB();

  let docCount = 0;
  for (let i = 0; i < 50; i++) {
    const name = uniqueNamesGenerator({
      dictionaries: [names],
      length: 1,
    }).toLowerCase();

    const user =
      (
        await db
          .insert(users)
          .values({
            id: pika.gen("user"),
            api_token: pika.gen("imperial_auth"),
            email: `${name}@gmail.com`,
            username: name,
            icon: `https://github.com/${name}.png`,
            password: "password",
            confirmed: Math.random() > 0.5,
            banned: Math.random() > 0.15,
            settings: {
              font_size: 14,
              clipboard: Math.random() > 0.5,
              long_urls: Math.random() > 0.5,
              short_urls: Math.random() > 0.5,
              instant_delete: Math.random() > 0.5,
              encrypted: Math.random() > 0.5,
              expiration: null,
              image_embed: Math.random() > 0.5,
              create_gist: Math.random() > 0.5,
              font_ligatures: Math.random() > 0.5,
              word_wrap: Math.random() > 0.5,
              tab_size: 2,
              render_whitespace: Math.random() > 0.5,
            },
          })
          .returning()
      )[0] ?? null;

    if (Math.random() > 0.5 && user) {
      for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        docCount++;
        await db.insert(documents).values({
          id: nanoid(8),
          content: "Hello, world!",
          creator: user.id,
          created_at: new Date().toISOString(),
          settings: {
            language: "plaintext",
            editors: [],
            encrypted: false,
            image_embed: false,
            instant_delete: false,
            public: false,
          },
        });
      }
    }
  }

  Logger.info(
    "INIT",
    `Seeded database with 50 users and ${docCount} documents.`,
  );
  exit(0);
};

seed();
