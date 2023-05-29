import { permer, pika } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, SelfUser } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { SES } from "../../utils/aws";
import { bCrypt } from "../../utils/bcrypt";
import { env } from "../../utils/env";
import { parseDomainFromOrigin } from "../../utils/parse";
import { Redis } from "../../utils/redis";
import { usernameSchema } from "../../utils/schemas";
import { generateRandomSecureString } from "../../utils/strings";

const signupSchema = z.object({
  username: usernameSchema,
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const signup: FastifyImp<
  {
    Body: z.infer<typeof signupSchema>;
  },
  { token: string; user: SelfUser },
  false
> = async (request, reply) => {
  const body = signupSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: fromZodError(body.error).message,
        errors: body.error.errors,
      },
    });
  }

  const findUserByUsername = await db
    .select()
    .from(users)
    .where(eq(users.username, body.data.username));

  if (findUserByUsername.length > 0) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Username already exists",
      },
    });
  }

  const findUserByEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, body.data.email));

  if (findUserByEmail.length > 0) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Email already exists",
      },
    });
  }

  const hashedPassword = await bCrypt.hash(body.data.password);

  const user =
    (
      await db
        .insert(users)
        .values({
          id: pika.gen("user"),
          username: body.data.username,
          email: body.data.email,
          password: hashedPassword,
          api_token: pika.gen("imperial"),
          flags: permer.calculate(
            // Concat still is bad and doesn't infer types, i wonder if we'd benefit from typescript-reset
            ["member"].concat(
              !env.PRODUCTION &&
                body.data.username.startsWith("unit-test-admin-")
                ? ["admin"]
                : [],
            ) as ["member" | "admin"],
          ),
          settings: {
            clipboard: false,
            long_urls: false,
            short_urls: false,
            instant_delete: false,
            encrypted: false,
            image_embed: false,
            expiration: null,
            font_ligatures: false,
            font_size: 14,
            render_whitespace: false,
            word_wrap: false,
            tab_size: 2,
            create_gist: false,
          },
        })
        .returning()
    )[0] ?? null;

  if (!user) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
        message: "Something went wrong",
      },
    });
  }

  const token = await AuthSessions.createDevice(
    user.id,
    request.headers["user-agent"] ?? "Unknown",
    request.ip,
  );

  const { password, ...userWithoutPassword } = user;

  const confirmToken = generateRandomSecureString(32);
  await Redis.set("confirm_email_token", confirmToken, user.id, {
    EX: 60 * 60 * 24 * 7,
  });
  await SES.sendEmail(
    "confirm_email",
    {
      token: confirmToken,
    },
    user.email,
    "Confirm Email",
  );

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
