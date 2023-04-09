import { desc, eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents, users } from "../../db/schemas";
import { Document, FastifyImp } from "../../types";
import {
  DOCUMENT_PUBLIC_OBJECT,
  getEditorsByIds,
  getLinksObject,
} from "../../utils/publicObjects";

export const getRecentDocuments: FastifyImp<{}, unknown, true> = async (
  request,
  reply,
) => {
  const recentDocuments = await db
    .select(DOCUMENT_PUBLIC_OBJECT)
    .from(documents)
    .where(eq(documents.creator, request.user.id))
    .orderBy(desc(documents.created_at))
    .leftJoin(users, eq(users.id, documents.creator))
    .limit(10);

  const newDocuments: Document[] = [];

  for (const document of recentDocuments) {
    const editors = await getEditorsByIds(document.settings.editors);

    newDocuments.push({
      ...document,
      links: getLinksObject(document.id),
      gist_url: document.gist_url,
      settings: {
        ...document.settings,
        editors,
      },
    });
  }

  reply.send({
    success: true,
    data: newDocuments,
  });
};
