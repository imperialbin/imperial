import { Id } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { bCrypt } from "../../utils/bcrypt";

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

  if (!(await bCrypt.compare(body.data.old_password, request.user.password))) {
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
      password: await bCrypt.hash(body.data.new_password),
    })
    .where(eq(users.id, request.user.id));

  await AuthSessions.deleteAllSessionsForUser(
    request.user.id,
    request.authentication_token as Id<"imperial_auth">,
  );

  reply.status(204).send();
};
