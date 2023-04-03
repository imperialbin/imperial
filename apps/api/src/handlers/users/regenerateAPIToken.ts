import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { pika } from "@imperial/commons";

export const regenerateAPIToken: FastifyImp = async (request, reply) => {
  if (!request.user) {
    return;
  }

  const updatedUser =
    (
      await db
        .update(users)
        .set({
          api_token: pika.gen("imperial_auth"),
        })
        .where(eq(users.id, request.user.id))
        .returning()
    )[0] ?? null;

  if (!updatedUser) {
    reply.status(500).send({
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
