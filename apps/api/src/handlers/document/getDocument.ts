import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents, users } from "../../db/schemas";
import { Document, FastifyImp } from "../../types";
import { decrypt } from "../../utils/crypto";
import { Logger } from "../../utils/logger";
import {
  DOCUMENT_PUBLIC_OBJECT,
  getEditorsByIds,
  getLinksObject,
} from "../../utils/publicObjects";

export const getDocument: FastifyImp<
  {
    Querystring: {
      password?: string;
    };
    Params: {
      id: string;
    };
  },
  Document
> = async (request, reply) => {
  const { id } = request.params;
  const { password } = request.query;

  const document =
    (
      await db
        .select(DOCUMENT_PUBLIC_OBJECT)
        .from(documents)
        .leftJoin(users, eq(users.id, documents.creator))
        .where(eq(documents.id, id))
    )[0] ?? null;

  if (
    !document ||
    (document.timestamps.expiration &&
      new Date(document?.timestamps?.expiration) < new Date())
  ) {
    return reply.status(404).send({
      success: false,
      error: {
        message: "Document not found",
      },
    });
  }

  let { content } = document;
  if (document.settings.encrypted && password) {
    try {
      content = decrypt(password, document.content);
    } catch (e) {
      // If its not a bad password log
      if (!String(e).includes("routines:EVP_DecryptFinal_ex:bad")) {
        Logger.error("crypto", "Failed to decrypt document " + String(e));
      }

      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid password",
        },
      });
    }
  }

  const editors = await getEditorsByIds(document.settings.editors);

  await db
    .update(documents)
    .set({
      views: document.views + 1,
    })
    .where(eq(documents.id, id));

  reply.send({
    success: true,
    data: {
      ...document,
      content,
      links: getLinksObject(document.id),
      views: document.views + 1,
      settings: {
        ...document.settings,
        editors,
      },
      gist_url: document.gist_url,
    },
  });
};