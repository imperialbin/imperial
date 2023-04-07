import { FastifyImp } from "../../types";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { eq } from "drizzle-orm/expressions";
import { permer } from "@imperial/commons";

const patchUserSchema = z.object({
  email: z.string().email().optional(),
  icon: z.string().url().or(z.null()).optional(),
  memberPlus: z.boolean().optional(),
  banned: z.boolean().optional(),
  username: z.string().optional(),
  confirmed: z.boolean().optional(),
});

export const patchUser: FastifyImp<
  unknown,
  unknown,
  {
    username: string;
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

  const updatedUser =
    (
      await db
        .update(users)
        .set({
          email: body.data.email ?? request.user.email,
          icon: body.data.icon ?? request.user.icon,
          banned: body.data.banned ?? request.user.banned,
          flags: body.data.memberPlus
            ? permer.add(request.user.flags, ["member-plus"])
            : request.user.flags,
          username: body.data.username ?? request.user.username,
          confirmed: body.data.confirmed ?? request.user.confirmed,
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
