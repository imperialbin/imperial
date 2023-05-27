import { FastifyInstance } from "fastify";
import { github } from "../handlers/oauth/github";
import { stripeWebhook } from "../handlers/stripe/webhook";
import { RP } from "../types";

export const stripeRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.post<RP<typeof github>>(
    "/webhook",
    {
      config: {
        rawBody: true,
      },
    },
    stripeWebhook,
  );

  done();
};
