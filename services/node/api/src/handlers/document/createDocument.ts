import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "../../db";
import { documents, users } from "../../db/schemas";
import { eq } from "drizzle-orm/expressions";
import { FastifyImp, User } from "../../types";
import { encrypt } from "../../utils/crypto";
import { guessLanguage } from "../../utils/language";
import { generateRandomSecureString } from "../../utils/strings";
import { GitHub } from "../../utils/github";

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
  {
    id: string;
    content: string;
    password?: string | undefined;
    creator: User | null;
    gist_url: string | null;
    views: number;
    timestamps: {
      creation: string;
      expiration: string | null;
    };
    links: {
      raw: string;
      formatted: string;
    };
    settings: {
      language: string;
      image_embed: boolean;
      instant_delete: boolean;
      encrypted: boolean;
      public: boolean;
      editors: User[];
    };
  },
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
  let content = body.data.content;

  // URL configuration
  if (body.data.settings?.short_urls) {
    id = nanoid(4);
  } else if (body.data.settings?.long_urls) {
    id = nanoid(36);
  }

  // Encryption configuration
  let password = body.data.settings?.password ?? undefined;
  if (
    body.data.settings?.encrypted &&
    // We encrypt on the frontend by default, but if you hit our API, we'll make sure to encrypt it for you :D
    !content.startsWith("IMPERIAL_ENCRYPTED")
  ) {
    if (!password) {
      password = generateRandomSecureString(16);
    }

    content = encrypt(password, body.data.content);
  }

  // Gist configuration
  let gistId: string | null = null;
  if (body.data.settings?.create_gist) {
    gistId = await GitHub.createGist(body.data.content, id, "fake_user_auth");
  }

  // language configuration
  let language = body.data.settings?.language ?? "plaintext";
  if (body.data.settings?.language === "auto") {
    language = await guessLanguage(body.data.content);
  }

  // Editors configuration
  let editors: User[] = [];
  if (body.data.settings?.editors) {
    for (const editor of body.data.settings.editors) {
      const user =
        (
          await db
            .select()
            .from(users)
            .where(eq(users.username, editor))
            .limit(1)
        )[0] ?? null;

      if (!user) continue;

      editors.push({
        id: user.id,
        username: user.username,
        documents_made: user.documents_made,
        flags: user.flags,
        icon: user.icon,
      });
    }
  }

  const createdDocument =
    (
      await db
        .insert(documents)
        .values({
          id,
          content,
          created_at: new Date().toISOString(),
          gist_url: gistId,
          settings: {
            language: language,
            editors: editors.map((user) => user.id),
            image_embed: body.data.settings?.image_embed ?? false,
            instant_delete: body.data.settings?.instant_delete ?? false,
            encrypted: body.data.settings?.encrypted ?? false,
            public: body.data.settings?.public ?? false,
          },
        })
        .returning()
    )[0] ?? null;

  if (!createdDocument) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
        message: "Failed to create document",
      },
    });
  }

  reply.send({
    success: true,
    data: {
      id,
      content,
      password,
      creator: null,
      gist_url: gistId,
      views: 0,
      links: {
        raw: `https://imperialb.in/raw/${id}`,
        formatted: `https://imperialb.in/${id}`,
      },
      timestamps: {
        creation: createdDocument.created_at,
        expiration: null,
      },
      settings: { ...createdDocument.settings, editors },
    },
  });
};
