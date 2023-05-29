import { pika, Theme } from "@imperial/commons";
import { themes } from "@imperial/internal";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { FastifyImp } from "../../types";

const createDesignSchema = z.object({
  token: z.string().min(16),
  description: z.string().min(1).max(200),
  name: z.string().min(1).max(80),
  private: z.boolean().optional().default(false),
});

export const createDesign: FastifyImp<
  {
    Body: z.infer<typeof createDesignSchema>;
  },
  Theme,
  true
> = async (request, reply) => {
  const body = createDesignSchema.safeParse(request.body);
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

  const id = pika.gen("theme");

  const theme = (
    await db
      .insert(themes)
      .values({
        id,
        token: body.data.token,
        description: body.data.description,
        name: body.data.name,
        private: body.data.private,
        created_at: new Date().toISOString(),
        creator: request.user.id,
        official: false,
      })
      .returning()
  )[0];

  if (!theme) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
        message: "Failed to create theme",
      },
    });
  }

  return reply.status(200).send({
    success: true,
    data: {
      id: theme.id,
      token: theme.token,
      description: theme.description,
      name: theme.name,
      private: theme.private,
      created_at: theme.created_at,
      creator: {
        id: request.user.id,
        username: request.user.username,
        documents_made: request.user.documents_made,
        flags: request.user.flags,
        icon: request.user.icon,
      },
      official: theme.official,
    },
  });
};
