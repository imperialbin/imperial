import { eq } from "drizzle-orm/expressions";
import { db } from "../db";
import { documents, users } from "../db/schemas";
import { User } from "../types";
import { env } from "./env";
import { Id } from "./pika";

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
  gist_id: documents.gist_id,
  timestamps: {
    creation: documents.created_at,
    expiration: documents.expires_at,
  },
  settings: documents.settings,
};

const getEditorsByIds = async (ids: Array<Id<"user">>) => {
  const editorPartials: User[] = [];

  for (const id of ids) {
    const editorPartial = await db
      .select({
        id: users.id,
        username: users.username,
        documents_made: users.documents_made,
        flags: users.flags,
        icon: users.icon,
      })
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
      .select({
        id: users.id,
        username: users.username,

        documents_made: users.documents_made,
        flags: users.flags,
        icon: users.icon,
      })
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
  getEditorsByIds,
  getLinksObject,
  getEditorsByUsername,
};
