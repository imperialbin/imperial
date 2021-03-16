import IORedis from "ioredis";

// ENV
const URL = process.env.REDIS_URI ?? "redis://localhost:56379";

export const redis = new IORedis(URL);

export const getRateLimit = async (apiToken: string): Promise<boolean> => {
  const rateLimited = await redis.get(`ratelimit:${apiToken}`);

  if (rateLimited) {
    return false;
  }

  await redis.set(`ratelimit:${apiToken}`, "yes", "ex", 10);
  return true;
};
