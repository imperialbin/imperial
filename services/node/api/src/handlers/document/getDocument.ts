import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { Document, FastifyImp } from "../../types";
import { decrypt } from "../../utils/crypto";
import { documentPublicObject } from "../../utils/publicObjects";

export const getDocument: FastifyImp<
  Document,
  unknown,
  {
    password?: string;
  },
  {
    id: string;
  }
> = async (request, reply) => {
  const id = request.params.id;
  const password = request.query.password;

  const document =
    (await db.select().from(documents).where(eq(documents.id, id)))[0] ?? null;

  if (!document) {
    return reply.status(404).send({
      success: false,
      data: {
        message: "Document not found",
      },
    });
  }

  let content = document.content;
  if (document.settings.encrypted && password) {
    try {
      content = await decrypt(password, document.content, "what");
    } catch (e) {
      return reply.status(400).send({
        success: false,
        data: {
          message: "Invalid password",
        },
      });
    }
  }

  reply.send({
    success: true,
    data: documentPublicObject({ ...document, content }, password),
  });
};
