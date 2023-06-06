import { FastifyInstance } from "fastify";
import { githubWebhook } from "../handlers/github/webhook";
import { RP } from "../types";

export const githubRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.post<RP<typeof githubWebhook>>(
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
