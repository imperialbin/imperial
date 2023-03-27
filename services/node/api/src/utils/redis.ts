import { createClient } from "redis";
import { env } from "./env";

export let redis: ReturnType<typeof createClient>;

export const setupRedis = async () => {
  redis = await createClient({
    url: env.REDIS_URL,
  });

  redis.on("error", (err) => {
    console.error("Redis error", err);
    process.exit(1);
  });

  redis.on("connect", () => {
    console.log("Connected to redis");
  });

  await redis.connect();
};
