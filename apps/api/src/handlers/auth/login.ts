import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, SelfUser } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { SES } from "../../utils/aws";
import { fromZodError } from "zod-validation-error";

const loginSchema = z.object({
  username: z.string().min(1).or(z.string().email()),
  password: z.string().min(8),
});

export const login: FastifyImp<
  {
    Body: z.infer<typeof loginSchema>;
  },
  { token: string; user: SelfUser }
> = async (request, reply) => {
  const body = loginSchema.safeParse(request.body);
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
      await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.username, body.data.username),
            eq(users.email, body.data.username),
          ),
        )
    )[0] ?? null;

  if (!user) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Incorrect username or password",
      },
    });
  }

  if (user.banned) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "You are banned",
      },
    });
  }

  if (!(await bcrypt.compare(body.data.password, user.password))) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
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

  reply
    .setCookie("imperial-auth", token, {
      domain: `.${request.hostname}`,
    })
    .send({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    });
};
