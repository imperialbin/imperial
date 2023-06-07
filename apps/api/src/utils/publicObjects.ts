import { Id } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { devices, documents, users } from "../db/schemas";
import { User } from "../types";
import { env } from "./env";

const DOCUMENT_PUBLIC_OBJECT = {
  id: documents.id,
  content: documents.content,
  creator: {
    documents_made: users.documents_made,
    id: users.id,
    username: users.username,
    flags: users.flags,
    icon: users.icon,
  },
  views: documents.views,
  gist_url: documents.gist_url,
  timestamps: {
    creation: documents.created_at,
    expiration: documents.expires_at,
  },
  settings: documents.settings,
};

const USER_PUBLIC_OBJECT = {
  id: users.id,
  username: users.username,
  documents_made: users.documents_made,
  flags: users.flags,
  icon: users.icon,
};

const DEVICES_PUBLIC_OBJECT = {
  id: devices.id,
  user_agent: devices.user_agent,
  ip: devices.ip,
  created_at: devices.created_at,
};

const getEditorsByIds = async (ids: Array<Id<"user">>) => {
  const editorPartials: User[] = [];

  for (const id of ids) {
    const editorPartial = await db
      .select(USER_PUBLIC_OBJECT)
      .from(users)
      .where(eq(users.id, id));

    if (editorPartial.length === 0) {
      continue;
    }

    editorPartials.push(editorPartial[0]);
  }

  return editorPartials;
};

// Todo: remove this WET
const getEditorsByUsername = async (usernames: string[]) => {
  const editorPartials: User[] = [];

  for (const username of usernames) {
    const editorPartial = await db
      .select(USER_PUBLIC_OBJECT)
      .from(users)
      .where(eq(users.username, username));

    if (editorPartial.length === 0) {
      continue;
    }

    editorPartials.push(editorPartial[0]);
  }

  return editorPartials;
};

const getLinksObject = (id: string) => ({
  formatted: `${env.FRONTEND_URL}/${id}`,
  raw: `${env.FRONTEND_URL}/r/${id}`,
});

export {
  DOCUMENT_PUBLIC_OBJECT,
  USER_PUBLIC_OBJECT,
  getEditorsByIds,
  getLinksObject,
  getEditorsByUsername,
  DEVICES_PUBLIC_OBJECT,
};
