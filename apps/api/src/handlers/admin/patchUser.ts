/* eslint-disable no-negated-condition */
import { FastifyImp } from "../../types";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { eq } from "drizzle-orm/expressions";
import { Id, permer } from "@imperial/commons";

const patchUserSchema = z.object({
  email: z.string().email().optional(),
  icon: z.string().url().or(z.null()).optional(),
  member_plus: z.boolean().optional(),
  banned: z.boolean().optional(),
  username: z.string().optional(),
  confirmed: z.boolean().optional(),
});

export const patchUser: FastifyImp<
  unknown,
  unknown,
  unknown,
  {
    id: Id<"user">;
  }
> = async (request, reply) => {
  if (!request.user || !permer.test(request.user.flags, "admin")) {
    return reply.status(403).send({
      success: false,
      error: {
        message: "You are not an admin",
      },
    });
  }

  const body = patchUserSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid body",
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
