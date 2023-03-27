import { FastifyImp, SelfUser } from "../../types";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { eq } from "drizzle-orm/expressions";
import bcrypt from "bcrypt";
import { pika } from "../../utils/pika";
import { Devices } from "../../utils/devices";
import { redis } from "../../utils/redis";

const signupSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signup: FastifyImp<{ token: string; user: SelfUser }, {}> = async (
  request,
  reply
) => {
  const body = signupSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: body.error.message,
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
        message: "Email already exists",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(body.data.password, 10);

  const user =
    (
      await db
        .insert(users)
        .values({
          username: body.data.username,
          email: body.data.email,
          password: hashedPassword,
          api_token: pika.gen("imperial"),
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

  if (!user || !user.settings) {
    return reply.status(500).send({
      success: false,
      error: {
        message: "Something went wrong",
      },
    });
  }

  // create auth token and device in db
  const token = pika.gen("imperial_auth");
  await Devices.create(
    user.id,
    request.headers["user-agent"] ?? "Unknown",
    request.ip,
    token
  );

  await redis.set(token, user.id);
  const { password, ...userWithoutPassword } = user;

  reply.send({
    success: true,
    data: {
      token: "what",
      user: {
        ...userWithoutPassword,
        settings: user.settings,
      },
    },
  });
};
