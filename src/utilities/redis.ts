import IORedis from "ioredis";

// ENV
const URL = process.env.REDIS_HOST ?? "redis://localhost:56379";
export const redis = new IORedis(URL);

/**
 * @param  {string} apiToken
 * @returns Promise
 */
export const getRateLimit = async (apiToken: string): Promise<boolean> => {
  const rateLimited = await redis.get(`ratelimit:${apiToken}`);

  if (rateLimited) return false;

  await redis.set(`ratelimit:${apiToken}`, "yes", "ex", 10);
  return true;
};
