/* eslint-disable no-negated-condition */
import { Id, permer } from "@imperial/commons";
import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";

const patchUserSchema = z.object({
  email: z.string().email().optional(),
  icon: z.string().url().or(z.null()).optional(),
  member_plus: z.boolean().optional(),
  banned: z.boolean().optional(),
  username: z.string().optional(),
  confirmed: z.boolean().optional(),
});

export const patchUser: FastifyImp<
  {
    Params: {
      id: Id<"user">;
    };
  },
  unknown,
  true
> = async (request, reply) => {
  const body = patchUserSchema.safeParse(request.body);

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

  if (body.data.username) {
    const user =
      (
        await db
          .select()
          .from(users)
          .where(eq(users.username, body.data.username))
      )[0] ?? null;

    if (user) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "bad_request",
          message: "Username is already taken",
        },
      });
    }
  }

  const originalUser =
    (await db.select().from(users).where(eq(users.id, request.params.id)))[0] ??
    null;

  if (!originalUser) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "User not found",
      },
    });
  }

  const updatedUser =
    (
      await db
        .update(users)
        .set({
          email: body.data.email ?? originalUser.email,
          icon: body.data.icon ?? originalUser.icon,
          banned: body.data.banned ?? originalUser.banned,
          flags:
            body.data.member_plus !== undefined
              ? body.data.member_plus
                ? permer.add(originalUser.flags, ["member-plus"])
                : permer.subtract(originalUser.flags, ["member-plus"])
              : originalUser.flags,
          username: body.data.username ?? originalUser.username,
          confirmed: body.data.confirmed ?? originalUser.confirmed,
        })
        .where(eq(users.id, request.params.id))
        .returning()
    )[0] ?? null;

  if (!updatedUser) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
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
