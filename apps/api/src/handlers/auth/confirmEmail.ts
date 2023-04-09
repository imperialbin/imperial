import { Id } from "@imperial/commons";
import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { Redis } from "../../utils/redis";

export const confirmEmail: FastifyImp<{
  Querystring: {
    token: string;
  };
}> = async (request, reply) => {
  const { token } = request.query;

  const maybeUserId = await Redis.get<Id<"user">>("confirm_email_token", token);
  if (!maybeUserId) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid token",
      },
    });
  }

  const user =
    (await db.select().from(users).where(eq(users.id, maybeUserId)))[0] ?? null;
  if (!user) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "User no longer exists",
      },
    });
  }

  await db.update(users).set({
    confirmed: true,
  });

  return reply.status(204).send();
};
