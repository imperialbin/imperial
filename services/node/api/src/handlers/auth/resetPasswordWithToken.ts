import bcrypt from "bcrypt";
import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { Id } from "../../utils/pika";
import { redis } from "../../utils/redis";

const resetPasswordWithTokenBody = z.object({
  token: z.string().length(32),
  newPassword: z.string().min(8),
});

export const resetPasswordWithToken: FastifyImp = async (request, reply) => {
  const body = resetPasswordWithTokenBody.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: body.error.message,
      },
    });
  }

  const tokenInRedis = (await redis.get(
    "resetPassword:" + body.data.token
  )) as Id<"user"> | null;
  if (!tokenInRedis) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid token",
      },
    });
  }

  const user =
    (await db.select().from(users).where(eq(users.id, tokenInRedis)))[0] ??
    null;

  if (!user) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "User no longer exists",
      },
    });
  }

  await db.update(users).set({
    password: await bcrypt.hash(body.data.newPassword, 10),
  });

  await redis.del("resetPassword:" + body.data.token);
  await AuthSessions.deleteAllSessionsForUser(user.id);

  reply.status(204).send();
};
