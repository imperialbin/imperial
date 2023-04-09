import { InferModel } from "drizzle-orm";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { Redis } from "../../utils/redis";
import { Id } from "@imperial/commons";
import { db } from "../../db";
import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { generateRandomSecureString } from "../../utils/strings";
import { SES } from "../../utils/aws";

const resendConfirmEmailBody = z.object({
  email: z.string().email(),
});

export const resendConfirmEmail: FastifyImp<{
  Body: z.infer<typeof resendConfirmEmailBody>;
}> = async (request, reply) => {
  const body = resendConfirmEmailBody.safeParse(request.body);
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

  if (!user) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "User not found",
      },
    });
  }

  if (user.confirmed) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "User already confirmed",
      },
    });
  }

  const token = generateRandomSecureString(32);
  await Redis.set("confirm_email_token", token, user.id, {
    EX: 60 * 60 * 24 * 7,
  });
  await SES.sendEmail(
    "confirm_email",
    {
      token,
    },
    user.email,
    "Confirm Email",
  );

  reply.status(204).send();
};
