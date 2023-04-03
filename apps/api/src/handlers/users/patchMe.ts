import { FastifyImp } from "../../types";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { eq } from "drizzle-orm/expressions";

const patchMeSchema = z.object({
  email: z.string().email().optional(),
  icon: z.string().url().or(z.null()).optional(),
  settings: z
    .object({
      clipboard: z.boolean().optional(),
      long_urls: z.boolean().optional(),
      short_urls: z.boolean().optional(),
      instant_delete: z.boolean().optional(),
      encrypted: z.boolean().optional(),
      image_embed: z.boolean().optional(),
      expiration: z.number().or(z.null()).optional(),
      font_ligatures: z.boolean().optional(),
      font_size: z.number().optional(),
      render_whitespace: z.boolean().optional(),
      word_wrap: z.boolean().optional(),
      tab_size: z.number().optional(),
      create_gist: z.boolean().optional(),
    })
    .optional(),
});

export const patchMe: FastifyImp = async (request, reply) => {
  if (!request.user) {
    return;
  }

  const body = patchMeSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid body",
        errors: body.error.errors,
      },
    });
  }

  const updatedUser =
    (
      await db
        .update(users)
        .set({
          email: body.data.email ?? request.user.email,
          icon: body.data.icon ?? request.user.icon,
          settings: {
            ...request.user.settings,
            ...body.data.settings,
          },
        })
        .where(eq(users.id, request.user.id))
        .returning()
    )[0] ?? null;

  if (!updatedUser) {
    return reply.status(500).send({
      success: false,
      error: {
        message: "Failed to update user",
      },
    });
  }

  const { password, ...userWithoutPassword } = updatedUser;

  reply.send({
    success: true,
    data: userWithoutPassword,
  });
};
