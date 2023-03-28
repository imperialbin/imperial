import { eq } from "drizzle-orm/expressions";
import { db } from "../db";
import { devices, users } from "../db/schemas";
import { Id, pika } from "./pika";
import { redis } from "./redis";

export class AuthSessions {
  public static async createDevice(
    userId: Id<"user">,
    userAgent: string,
    ip: string
  ) {
    const token = pika.gen("imperial_auth");

    await db
      .insert(devices)
      .values({
        id: pika.gen("device"),
        user: userId,
        user_agent: userAgent,
        ip,
        auth_token: token,
        created_at: new Date().toISOString(),
      })
      .returning();

    await redis.set(token, userId);

    return token;
  }

  public static async deleteDevice(token: string) {
    await redis.del(token);
    await db.delete(devices).where(eq(devices.auth_token, token));
  }

  public static async findUserByToken(token: string) {
    const tokenInRedis = (await redis.get(token)) as Id<"user"> | undefined;

    if (!tokenInRedis) {
      return null;
    }

    const user =
      (await db.select().from(users).where(eq(users.id, tokenInRedis)))[0] ??
      null;

    return user;
  }
}
