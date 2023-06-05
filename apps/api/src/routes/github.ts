import { FastifyInstance } from "fastify";
import { githubWebhook } from "../handlers/github/webhook";
import { github } from "../handlers/oauth/github";
import { RP } from "../types";

export const githubRoutes = (
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
    githubWebhook,
  );

  done();
};
