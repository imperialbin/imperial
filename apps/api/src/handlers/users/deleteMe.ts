import bcrypt from "bcrypt";
import { FastifyImp } from "../../types";

import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { db } from "../../db";
import { devices, users } from "../../db/schemas";

const deleteMeSchema = z.object({
  password: z.string().min(8),
});

export const deleteMe: FastifyImp<unknown, {}> = async (request, reply) => {
  if (!request.user) {
    return;
  }

  const body = deleteMeSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid body",
        errors: body.error.errors,
      },
    });
  }

  const { password } = body.data;
  if (!(await bcrypt.compare(password, request.user.password))) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Invalid password",
      },
    });
  }

  await db.delete(users).where(eq(users.id, request.user.id));

  reply.status(204).send();
};
