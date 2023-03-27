import { InferModel } from "drizzle-orm";
import { documents } from "../db/schemas";
import { Document } from "../types";

const documentPublicObject = (
  document: InferModel<typeof documents>,
  password?: string
): Document => {
  return {
    content: document.content,
    id: document.id,
    views: document.views,
    links: {
      formatted: `https://imperialb.in/${document.id}`,
      raw: `https://imperialb.in/raw/${document.id}`,
    },
    timestamps: {
      creation: document.created_at,
      expiration: document.expires_at,
    },
    creator: null,
    settings: {
      editors: [],
      encrypted: document.settings.encrypted,
      instant_delete: document.settings.instant_delete,
      image_embed: document.settings.image_embed,
      language: document.settings.language,
      public: document.settings.public,
      password,
    },
  };
};

export { documentPublicObject };
