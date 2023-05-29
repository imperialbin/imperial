import { FastifyImp } from "../../types";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { bCrypt } from "../../utils/bcrypt";

const deleteMeSchema = z.object({
  password: z.string().min(8),
});

export const deleteMe: FastifyImp<{}, unknown, true> = async (
  request,
  reply,
) => {
  const body = deleteMeSchema.safeParse(request.body);
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

  const { password } = body.data;
  if (!(await bCrypt.compare(password, request.user.password))) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Invalid password",
      },
    });
  }

  await db.delete(users).where(eq(users.id, request.user.id));

  reply.status(204).send();
};
