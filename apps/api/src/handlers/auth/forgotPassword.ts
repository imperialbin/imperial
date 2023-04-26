import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { SES } from "../../utils/aws";
import { Redis } from "../../utils/redis";
import { generateRandomSecureString } from "../../utils/strings";
import { fromZodError } from "zod-validation-error";

const forgotPasswordBody = z.object({
  email: z.string().email(),
});

export const forgotPassword: FastifyImp<{
  Body: z.infer<typeof forgotPasswordBody>;
}> = async (request, reply) => {
  const body = forgotPasswordBody.safeParse(request.body);
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

  const user =
    (
      await db.select().from(users).where(eq(users.email, body.data.email))
    )[0] ?? null;

  // If user doesn't exist, still send 204 to prevent email enumeration :3
  if (!user) {
    return reply.status(204).send();
  }

  const token = generateRandomSecureString(32);
  await Redis.set("reset_token", token, user.id, {
    EX: 60 * 60 * 24,
  });

  await SES.sendEmail(
    "reset_password",
    { token },
    user.email,
    "Reset Password",
  );

  reply.status(204).send();
};
