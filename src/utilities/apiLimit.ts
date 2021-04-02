import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "./redis"

export const rateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    expiry: 20,
  }),
  max: 30,
});
