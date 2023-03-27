import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const deleteDocument: FastifyImp<
  unknown,
  unknown,
  unknown,
  {
    id: string;
  }
> = async (request, reply) => {
  const id = request.params.id;
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

  // check if user is authorized and owns the document

  await db.delete(documents).where(eq(documents.id, id));

  reply.status(204);
};
