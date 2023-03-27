import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { Document, FastifyImp } from "../../types";
import { documentPublicObject } from "../../utils/publicObjects";

const patchDocumentSchema = z.object({
  id: z.string().min(4).max(36),
  content: z.string().min(1).optional(),
  settings: z.object({
    language: z.string().min(1).max(100).optional(),
    expiration: z.string().or(z.null()).optional(),
    image_embed: z.boolean().optional(),
    instant_delete: z.boolean().optional(),
    public: z.boolean().optional(),
    editors: z.array(z.string().min(1).max(200)).optional(),
  }),
});

export const patchDocument: FastifyImp<Document> = async (request, reply) => {
  const body = patchDocumentSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: body.error.message,
      },
    });
  }

  const id = body.data.id;
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

  // check if user is creator or editor

  if (document.settings.encrypted) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "You can not edit an encrypted document",
      },
    });
  }

  const updatedDocument =
    (
      await db
        .update(documents)
        .set({
          content: body.data.content ?? document.content,
          expires_at: body.data.settings.expiration ?? document.expires_at,
          settings: {
            language: body.data.settings.language ?? document.settings.language,
            image_embed:
              body.data.settings.image_embed ?? document.settings.image_embed,
            instant_delete:
              body.data.settings.instant_delete ??
              document.settings.instant_delete,
            public: body.data.settings.public ?? document.settings.public,
            editors: [],
            encrypted: document.settings.encrypted,
          },
        })
        .where(eq(documents.id, id))
        .returning()
    )[0] ?? null;

  reply.send({
    success: true,
    data: documentPublicObject(updatedDocument),
  });
};
