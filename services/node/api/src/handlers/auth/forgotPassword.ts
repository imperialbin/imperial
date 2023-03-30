import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { SES } from "../../utils/aws";
import { redis } from "../../utils/redis";
import { generateRandomSecureString } from "../../utils/strings";

const forgotPasswordBody = z.object({
  email: z.string().email(),
});

export const forgotPassword: FastifyImp = async (request, reply) => {
  const body = forgotPasswordBody.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: body.error.message,
      },
    });
  }

  const user =
    (
      await db.select().from(users).where(eq(users.email, body.data.email))
    )[0] ?? null;

  // If user doesn't exist, still send 204 to prevent email enumeration :3
  if (!user) {
    return reply.status(204).send();
  }

  const token = generateRandomSecureString(32);
  await redis.set("resetPassword:" + token, user.id, { EX: 60 * 60 * 24 });

  await SES.sendEmail(
    "reset_password",
    { token },
    user.email,
    "Reset Password"
  );

  reply.status(204).send();
};
