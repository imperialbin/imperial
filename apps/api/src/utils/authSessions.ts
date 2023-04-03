import { and, eq, ne } from "drizzle-orm/expressions";
import { db } from "../db";
import { devices, users } from "../db/schemas";
import { Id, pika } from "@imperial/commons";
import { redis } from "./redis";

export class AuthSessions {
  public static async createDevice(
    userId: Id<"user">,
    userAgent: string,
    ip: string,
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

  public static async deleteDeviceByAuthToken(token: string) {
    await redis.del(token);
    await db.delete(devices).where(eq(devices.auth_token, token));
  }

  public static async deleteDeviceById(id: Id<"device">) {
    const device =
      (await db.delete(devices).where(eq(devices.id, id)).returning())[0] ??
      null;

    if (device) {
      await redis.del(device.auth_token);
    }
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

  public static async deleteAllSessionsForUser(
    userId: Id<"user">,
    except?: Id<"imperial_auth">,
  ) {
    const usersDevices = await db
      .select()
      .from(devices)
      .where(eq(devices.user, userId));

    for (const device of usersDevices) {
      if (device.auth_token === except) {
        continue;
      }

      await redis.del(device.auth_token);
    }

    await db
      .delete(devices)
      .where(
        and(eq(devices.user, userId), ne(devices.auth_token, except ?? "")),
      );
  }
}
