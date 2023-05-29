import { Id } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { Redis } from "../../utils/redis";
import { fromZodError } from "zod-validation-error";

const confirmEmailBody = z.object({
  token: z.string().length(32),
});

export const confirmEmail: FastifyImp<{
  Body: z.infer<typeof confirmEmailBody>;
}> = async (request, reply) => {
  const body = confirmEmailBody.safeParse(request.body);
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

  const maybeUserId = await Redis.get<Id<"user">>(
    "confirm_email_token",
    body.data.token,
  );
  if (!maybeUserId) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
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
        code: "bad_request",
        message: "User no longer exists",
      },
    });
  }

  await db
    .update(users)
    .set({
      confirmed: true,
    })
    .where(eq(users.id, user.id));

  return reply.status(204).send();
};
