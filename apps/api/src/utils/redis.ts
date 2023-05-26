import { SetOptions, createClient } from "redis";
import { env } from "./env";
import { Logger } from "./logger";

type RedisPrefixes =
  | "api_token"
  | "reset_token"
  | "confirm_email_token"
  | "auth_token";

class Redis {
  public static redis: ReturnType<typeof createClient>;

  public static async initialize() {
    this.redis = createClient({
      url: env.REDIS_URL,
    });

    this.redis.on("error", (err) => {
      Logger.error("INIT", "Failed to connect to redis " + String(err));
      process.exit(1);
    });

    this.redis.on("connect", () => {
      Logger.info("INIT", "Connected to redis");
    });

    await this.redis.connect();
  }

  public static async set(
    type: RedisPrefixes,
    key: string,
    value: string,
    options?: SetOptions,
  ) {
    await this.redis.set(`${type}:${key}`, value, options);
  }

  public static async get<T>(type: RedisPrefixes, key: string) {
    return this.redis.get(`${type}:${key}`) as T | undefined;
  }

  public static async del(type: RedisPrefixes, key: string) {
    await this.redis.del(`${type}:${key}`);
  }
}

export { Redis, type RedisPrefixes };
