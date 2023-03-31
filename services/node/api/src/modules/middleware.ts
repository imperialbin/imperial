import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthSessions } from "../utils/authSessions";

const middleware = fp(
  async (fastify: FastifyInstance, _opts: unknown, done: () => void) => {
    fastify.addHook("preHandler", async (req, reply) => {
      if (req.headers.authorization) {
        const user = await AuthSessions.findUserByToken(
          req.headers.authorization,
        );

        req.user = user;
      }
    });
    done();
  },
);

const checkAuthentication = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!req.user) {
    reply.status(401).send({
      success: false,
      error: {
        message: "Unauthorized",
      },
    });
  }
};

export { middleware, checkAuthentication };
