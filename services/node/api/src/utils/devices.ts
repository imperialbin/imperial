import { db } from "../db";
import { devices } from "../db/schemas";
import { pika } from "./pika";
import { redis } from "./redis";

export class Devices {
  public static async create(
    userId: number,
    userAgent: string,
    ip: string,
    authToken: string
  ) {
    const token = pika.gen("imperial_auth");

    const createdDevice = await db
      .insert(devices)
      .values({
        id: pika.gen("device"),
        user: userId,
        user_agent: userAgent,
        ip,
        auth_token: authToken,
        created_at: new Date().toISOString(),
      })
      .returning();

    await redis.set(authToken, userId);

    return token;
  }
}
