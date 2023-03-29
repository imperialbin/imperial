import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { Id } from "../../utils/pika";

const resetPasswordBody = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const resetPassword: FastifyImp = async (request, reply) => {
  if (!request.user) {
    return;
  }

  const body = resetPasswordBody.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: body.error.message,
      },
    });
  }

  if (!(await bcrypt.compare(body.data.oldPassword, request.user.password))) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid password",
      },
    });
  }

  await db.update(users).set({
    password: await bcrypt.hash(body.data.newPassword, 10),
  });

  await AuthSessions.deleteAllSessionsForUser(
    request.user.id,
    request.headers.authorization as Id<"imperial_auth">
  );

  reply.status(204).send();
};
