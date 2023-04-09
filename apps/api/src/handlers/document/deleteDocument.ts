import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const deleteDocument: FastifyImp<
  {
    Params: {
      id: string;
    };
  },
  unknown,
  true
> = async (request, reply) => {
  const { id } = request.params;
  const document =
    (await db.select().from(documents).where(eq(documents.id, id)))[0] ?? null;

  if (!document) {
    return reply.status(404).send({
      success: false,
      error: {
        message: "Document not found",
      },
    });
  }

  if (request.user.id !== document.creator) {
    return reply.status(401).send({
      success: false,
      error: {
        message: "You do not own this document",
      },
    });
  }

  await db.delete(documents).where(eq(documents.id, id));

  reply.status(204).send();
};
