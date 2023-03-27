import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { FastifyImp } from "../../types";

const createDocumentSchema = z.object({
  content: z.string().min(1),
  settings: z
    .object({
      language: z.string().min(1).max(100).optional().default("plaintext"),
      expiration: z.string().or(z.null()).optional().default(null),
      short_urls: z.boolean().optional().default(false),
      long_urls: z.boolean().optional().default(false),
      image_embed: z.boolean().optional().default(false),
      instant_delete: z.boolean().optional().default(false),
      encrypted: z.boolean().optional().default(false),
      password: z.string().optional(),
      public: z.boolean().optional().default(false),
      editors: z.array(z.string().min(1).max(200)).optional(),
      create_gist: z.boolean().optional().default(false),
    })
    .optional(),
});

export const createDocument: FastifyImp<
  { test: string },
  z.infer<typeof createDocumentSchema>
> = async (request, reply) => {
  if (!request.body) {
    return reply.status(400).send({
      success: false,
      error: "No body provided",
    });
  }

  const body = createDocumentSchema.safeParse(request.body);

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "invalid_body",
        message: body.error.message,
      },
    });
  }

  let id = nanoid(8);

  if (body.data.settings?.short_urls) {
    id = nanoid(4);
  } else if (body.data.settings?.long_urls) {
    id = nanoid(36);
  }

  await db.insert(documents).values({
    content: body.data.content,
    id: id,
    createdAt: new Date().toISOString(),
    settings: {
      language: body.data.settings?.language,
      editors: [],
      image_embed: body.data.settings?.image_embed,
      instant_delete: body.data.settings?.instant_delete,
      encrypted: body.data.settings?.encrypted,
      public: body.data.settings?.public,
    },
  });

  reply.send({
    success: true,
    data: {
      test: id,
    },
  });
};
