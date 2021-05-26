import IORedis from "ioredis";
import { Consts } from "./consts";

// ENV
const URL = Consts.REDIS_HOST;
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
