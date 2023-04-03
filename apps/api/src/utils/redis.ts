import { createClient } from "redis";
import { env } from "./env";
import { Logger } from "./logger";

export let redis: ReturnType<typeof createClient>;

export const setupRedis = async () => {
  redis = createClient({
    url: env.REDIS_URL,
  });

  redis.on("error", (err) => {
    Logger.error("INIT", "Failed to connect to redis " + String(err));
    process.exit(1);
  });

  redis.on("connect", () => {
    Logger.info("INIT", "Connected to redis");
  });

  await redis.connect();
};
