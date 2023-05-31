/* eslint-disable complexity */
import { permer } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { documents, users } from "../../db/schemas";
import { Document, FastifyImp, User } from "../../types";
import { encrypt } from "../../utils/crypto";
import { env } from "../../utils/env";
import { GitHub } from "../../utils/github";
import { guessLanguage } from "../../utils/language";
import { getLinksObject } from "../../utils/publicObjects";
import { languageSchema } from "../../utils/schemas";
import { screenshotDocument } from "../../utils/screenshotDocument";
import {
  documentIdGenerator,
  generateRandomSecureString,
} from "../../utils/strings";

const createDocumentSchema = z.object({
  content: z.string().min(1),
  settings: z
    .object({
      language: languageSchema.optional().default("plaintext"),
      expiration: z.number().or(z.null()).optional().default(null),
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
    Body: z.infer<typeof createDocumentSchema>;
  },
  Document & {
    password?: string;
  }
> = async (request, reply) => {
  const body = createDocumentSchema.safeParse(request.body);
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

  // If they are not logged in dont allow any settings, but let them set the language
  if ((env.PRODUCTION && !request.user?.confirmed) || !request.user) {
    body.data.settings = {
      language: body.data.settings?.language ?? "plaintext",
      expiration: 7,
      short_urls: false,
      long_urls: false,
      image_embed: false,
      instant_delete: false,
      encrypted: false,
      public: false,
      create_gist: false,
      password: undefined,
      editors: [],
    };
  }

  let id = documentIdGenerator(8);
  let { content } = body.data;

  // URL configuration
  if (body.data.settings?.short_urls) {
    id = documentIdGenerator(4);
  } else if (body.data.settings?.long_urls) {
    id = documentIdGenerator(36);
  }

  // Encryption configuration
  const isMemberPlus = permer.test(request.user?.flags ?? 0, "member-plus");
  let password = body.data.settings?.password ?? undefined;
  if (
    isMemberPlus &&
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
  let gistURL: string | null = null;
  if (body.data.settings?.create_gist && request.user?.github) {
    gistURL =
      (
        await GitHub.createGist(
          body.data.content,
          id,
          request.user.github.token,
        )
      )?.html_url ?? null;
  }

  // Language configuration
  let language = body.data.settings?.language ?? "plaintext";
  if (body.data.settings?.language === "auto") {
    language = guessLanguage(body.data.content);
  }

  // Editors configuration
  const editors: User[] = [];
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

      if (!user) {
        continue;
      }

      editors.push({
        id: user.id,
        username: user.username,
        documents_made: user.documents_made,
        flags: user.flags,
        icon: user.icon,
      });
    }
  }

  let expires_at: string | null = null;
  if (body.data.settings?.expiration) {
    const date = new Date();
    date.setDate(date.getDate() + body.data.settings.expiration);
    expires_at = date.toISOString();
  }

  const createdDocument =
    (
      await db
        .insert(documents)
        .values({
          id,
          content,
          creator: request.user?.id ?? null,
          gist_url: gistURL,
          created_at: new Date().toISOString(),
          expires_at,
          settings: {
            language,
            image_embed: body.data.settings?.image_embed ?? false,
            instant_delete: body.data.settings?.instant_delete ?? false,
            encrypted: body.data.settings?.encrypted ?? false,
            public: body.data.settings?.public ?? false,
            editors: editors.map((user) => user.id),
          },
        })
        .returning()
    )[0] ?? null;

  if (
    createdDocument.settings.image_embed &&
    request.user &&
    isMemberPlus &&
    !createdDocument.settings.instant_delete &&
    !createdDocument.settings.encrypted
  ) {
    screenshotDocument(createdDocument.id, createdDocument.content, true);
  }

  if (request.user) {
    await db
      .update(users)
      .set({
        documents_made: request.user.documents_made + 1,
      })
      .where(eq(users.id, request.user.id));
  }

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
      id: createdDocument.id,
      // Use the content from the body, not the database, as the database content is (sometimes) encrypted
      content: body.data.content,
      password,
      creator: request.user
        ? {
            id: request.user.id,
            username: request.user.username,
            documents_made: request.user.documents_made + 1,
            flags: request.user.flags,
            icon: request.user.icon ?? null,
          }
        : null,
      gist_url: createdDocument.gist_url ?? null,
      views: 0,
      timestamps: {
        creation: createdDocument.created_at,
        expiration: createdDocument.expires_at,
      },
      links: getLinksObject(createdDocument.id),
      settings: {
        language: createdDocument.settings.language,
        image_embed: createdDocument.settings.image_embed,
        instant_delete: createdDocument.settings.instant_delete,
        encrypted: createdDocument.settings.encrypted,
        public: createdDocument.settings.public,
        password: password ?? undefined,
        editors,
      },
    },
  });
};
