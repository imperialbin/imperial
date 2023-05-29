import { Id } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { bCrypt } from "../../utils/bcrypt";
import { Redis } from "../../utils/redis";

const resetPasswordWithTokenBody = z.object({
  token: z.string().length(32),
  new_password: z.string().min(8),
});

export const resetPasswordWithToken: FastifyImp<
  {
    Body: z.infer<typeof resetPasswordWithTokenBody>;
  },
  unknown,
  false
> = async (request, reply) => {
  const body = resetPasswordWithTokenBody.safeParse(request.body);
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
    "reset_token",
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
      password: await bCrypt.hash(body.data.new_password),
    })
    .where(eq(users.id, user.id));

  await Redis.del("reset_token", body.data.token);
  await AuthSessions.deleteAllSessionsForUser(user.id);

  reply.status(204).send();
};
