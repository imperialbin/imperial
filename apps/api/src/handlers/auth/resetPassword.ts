import { Id } from "@imperial/commons";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { fromZodError } from "zod-validation-error";
import { eq } from "drizzle-orm";

const resetPasswordBody = z.object({
  old_password: z.string().min(8),
  new_password: z.string().min(8),
});

export const resetPassword: FastifyImp<
  {
    Body: z.infer<typeof resetPasswordBody>;
  },
  unknown,
  true
> = async (request, reply) => {
  const body = resetPasswordBody.safeParse(request.body);
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

  if (!(await bcrypt.compare(body.data.old_password, request.user.password))) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Invalid password",
      },
    });
  }

  await db
    .update(users)
    .set({
      password: await bcrypt.hash(body.data.new_password, 10),
    })
    .where(eq(users.id, request.user.id));

  await AuthSessions.deleteAllSessionsForUser(
    request.user.id,
    request.authentication_token as Id<"imperial_auth">,
  );

  reply.status(204).send();
};
