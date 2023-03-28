import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { AuthSessions } from "../utils/authSessions";

const middleware = fp(
  async (fastify: FastifyInstance, _opts: unknown, done: () => void) => {
    fastify.addHook("preHandler", async (req) => {
      if (req.headers.authorization) {
        const user = await AuthSessions.findUserByToken(
          req.headers.authorization
        );

        req.user = user;
      }
    });
    done();
  }
);

export { middleware };
