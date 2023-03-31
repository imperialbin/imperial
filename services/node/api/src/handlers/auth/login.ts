import bcrypt from "bcrypt";
import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, SelfUser } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { SES } from "../../utils/aws";

const loginSchema = z.object({
  username: z.string().min(1).or(z.string().email()),
  password: z.string().min(8),
});

export const login: FastifyImp<
  { token: string; user: SelfUser },
  Record<string, unknown>
> = async (request, reply) => {
  const body = loginSchema.safeParse(request.body);
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
      await db
        .select()
        .from(users)
        .where(eq(users.username, body.data.username))
    )[0] ?? null;

  if (!user) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Incorrect username or password",
      },
    });
  }

  if (user.banned) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "You are banned",
      },
    });
  }

  if (!(await bcrypt.compare(body.data.password, user.password))) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "Incorrect username or password",
      },
    });
  }

  const token = await AuthSessions.createDevice(
    user.id,
    request.headers["user-agent"] ?? "Unknown",
    request.ip,
  );

  SES.sendEmail(
    "new_login",
    {
      userAgent: {
        ip: request.ip,
        user_agent: request.headers["user-agent"] ?? "Unknown",
      },
    },
    user.email,
    "New Login",
  );

  const { password, ...userWithoutPassword } = user;

  reply.send({
    success: true,
    data: {
      token,
      user: userWithoutPassword,
    },
  });
};
