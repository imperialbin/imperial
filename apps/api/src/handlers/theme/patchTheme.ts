import { Id, Theme, pika } from "@imperial/commons";
import { themes } from "@imperial/internal";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { FastifyImp } from "../../types";
import { eq } from "drizzle-orm";

const patchThemeSchema = z.object({
  id: z.string().min(1),
  token: z.string().min(16).optional(),
  description: z.string().min(1).max(200).optional(),
  name: z.string().min(1).max(80).optional(),
  private: z.boolean().optional().default(false).optional(),
});

export const patchTheme: FastifyImp<{}, Theme, true> = async (
  request,
  reply,
) => {
  const body = patchThemeSchema.safeParse(request.body);
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

  if (pika.validate(body.data.id)) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Invalid theme id",
      },
    });
  }

  const theme = await db.query.themes.findFirst({
    where: (themes, { eq }) => eq(themes.id, body.data.id as Id<"theme">),
    with: {
      creator: true,
    },
  });

  if (!theme) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "Theme not found",
      },
    });
  }

  if (theme.creator?.id !== request.user.id) {
    return reply.status(403).send({
      success: false,
      error: {
        code: "bad_auth",
        message: "You are not allowed to edit this theme",
      },
    });
  }

  const updatedTheme =
    (
      await db
        .update(themes)
        .set({
          description: body.data.description ?? theme.description,
          name: body.data.name ?? theme.name,
          private: body.data.private ?? theme.private,
          token: body.data.token ?? theme.token,
        })
        .where(eq(themes.id, theme.id))
        .returning()
    )[0] ?? null;

  if (!updatedTheme) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
        message: "Failed to update theme",
      },
    });
  }

  reply.send({
    success: true,
    data: {
      ...updatedTheme,
      creator: theme.creator,
    },
  });
};
