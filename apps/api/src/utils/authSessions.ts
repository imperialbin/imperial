import { Id, pika } from "@imperial/commons";
import { and, eq, ne } from "drizzle-orm/expressions";
import { db } from "../db";
import { devices, users } from "../db/schemas";
import { Redis } from "./redis";

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

    await Redis.set("auth_token", token, userId);

    return token;
  }

  public static async deleteDeviceByAuthToken(token: Id<"imperial_auth">) {
    await Redis.del("auth_token", token);
    await db.delete(devices).where(eq(devices.auth_token, token));
  }

  public static async deleteDeviceById(id: Id<"device">) {
    const device =
      (await db.delete(devices).where(eq(devices.id, id)).returning())[0] ??
      null;

    if (device) {
      await Redis.del("auth_token", device.auth_token);
    }

    return Boolean(device);
  }

  public static async findUserByToken(token: string) {
    const maybeToken = await Redis.get<Id<"user">>("auth_token", token);

    if (!maybeToken) {
      if (
        token.startsWith("imperial_") &&
        !token.startsWith("imperial_auth_")
      ) {
        return this.findUserByAPIToken(token);
      }

      return null;
    }

    const user =
      (await db.select().from(users).where(eq(users.id, maybeToken)))[0] ??
      null;

    return user;
  }

  public static async findUserByAPIToken(token: string) {
    const maybeToken = await Redis.get<Id<"user">>("api_token", token);

    if (!maybeToken) {
      const user =
        (await db.select().from(users).where(eq(users.api_token, token)))[0] ??
        null;

      // If somehow the user has an api token but it's not in redis, add it
      if (user) {
        await Redis.set("api_token", token, user.id);
      } else {
        return null;
      }
    }

    const user =
      (await db.select().from(users).where(eq(users.api_token, token)))[0] ??
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

      await Redis.del("auth_token", device.auth_token);
    }

    await db
      .delete(devices)
      .where(
        and(
          eq(devices.user, userId),
          ne(devices.auth_token, except ?? "imperial_auth_"),
        ),
      );
  }
}
