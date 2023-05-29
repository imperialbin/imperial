import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, SelfUser } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { SES } from "../../utils/aws";
import { bCrypt } from "../../utils/bcrypt";
import { parseDomainFromOrigin } from "../../utils/parse";
import { generateRandomSecureString } from "../../utils/strings";
import { Redis } from "../../utils/redis";

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

  if (user.password.startsWith("$2b$10")) {
    const token = generateRandomSecureString(32);
    await Redis.set("reset_token", token, user.id, {
      EX: 60 * 60 * 24,
    });

    await SES.sendEmail(
      "reset_password",
      { token },
      user.email,
      "Reset Password",
    );

    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message:
          "Your password is using an outdated hashing algorithm. We've sent you an email to reset your password.",
      },
    });
  }

  if (!(await bCrypt.compare(body.data.password, user.password))) {
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
      domain: `.${parseDomainFromOrigin(
        request.headers.origin ?? "imperialb.in",
      )}`,
    })
    .send({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    });
};
