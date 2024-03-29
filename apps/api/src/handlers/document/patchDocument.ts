import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { documents, users } from "../../db/schemas";
import { Document, FastifyImp } from "../../types";
import {
  DOCUMENT_PUBLIC_OBJECT,
  getEditorsByIds,
  getEditorsByUsername,
  getLinksObject,
} from "../../utils/publicObjects";
import { languageSchema } from "../../utils/schemas";
import { fromZodError } from "zod-validation-error";
import { GitHub } from "../../utils/github";

const patchDocumentSchema = z.object({
  id: z.string().min(4).max(36),
  content: z.string().min(1).optional(),
  settings: z
    .object({
      language: languageSchema.optional(),
      expiration: z.string().or(z.null()).optional(),
      image_embed: z.boolean().optional(),
      instant_delete: z.boolean().optional(),
      public: z.boolean().optional(),
      editors: z.array(z.string().min(1).max(200)).optional(),
    })
    .optional(),
});

export const patchDocument: FastifyImp<
  {
    Body: z.infer<typeof patchDocumentSchema>;
  },
  Document,
  true
> = async (request, reply) => {
  const body = patchDocumentSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: fromZodError(body.error).toString(),
        errors: body.error.errors,
      },
    });
  }

  const { id } = body.data;
  const document =
    (
      await db
        .select(DOCUMENT_PUBLIC_OBJECT)
        .from(documents)
        .where(eq(documents.id, id))
        .leftJoin(users, eq(users.id, documents.creator))
    )[0] ?? null;

  if (!document) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "Document not found",
      },
    });
  }

  if (
    request.user.id !== document.creator?.id &&
    !document.settings.editors.includes(request.user.id)
  ) {
    return reply.status(403).send({
      success: false,
      error: {
        code: "bad_auth",
        message: "You are not allowed to edit this document",
      },
    });
  }

  if (document.settings.encrypted) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "You can not edit an encrypted document",
      },
    });
  }

  // We store the editors by id, so we need to get the ids of the usernames when appropriate
  const newEditors = body.data?.settings?.editors
    ? await getEditorsByUsername(body.data?.settings?.editors)
    : await getEditorsByIds(document.settings.editors);

  const updatedDocument =
    (
      await db
        .update(documents)
        .set({
          content: body.data.content ?? document.content,
          expires_at:
            body.data?.settings?.expiration ?? document.timestamps.expiration,
          settings: {
            language:
              body.data?.settings?.language ?? document.settings.language,
            image_embed:
              body.data?.settings?.image_embed ?? document.settings.image_embed,
            instant_delete:
              body.data?.settings?.instant_delete ??
              document.settings.instant_delete,
            public: body.data?.settings?.public ?? document.settings.public,
            editors: newEditors.map((editor) => editor.id),
            encrypted: document.settings.encrypted,
          },
        })
        .where(eq(documents.id, id))
        .returning()
    )[0] ?? null;

  if (request.user.github && updatedDocument.gist_url) {
    GitHub.editGist(
      updatedDocument.gist_url,
      updatedDocument.id,
      updatedDocument.content,
      request.user.github.token,
    );
  }

  reply.send({
    success: true,
    data: {
      id: updatedDocument.id,
      content: updatedDocument.content,
      creator: document.creator,
      gist_url: updatedDocument.gist_url,
      views: 0,
      timestamps: {
        creation: updatedDocument.created_at,
        expiration: updatedDocument.expires_at,
      },
      links: getLinksObject(updatedDocument.id),
      settings: {
        language: updatedDocument.settings.language,
        image_embed: updatedDocument.settings.image_embed,
        instant_delete: updatedDocument.settings.instant_delete,
        encrypted: updatedDocument.settings.encrypted,
        public: updatedDocument.settings.public,
        editors: newEditors,
      },
    },
  });
};
