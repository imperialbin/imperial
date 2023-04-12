/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthSessions } from "../utils/authSessions";
import { Id, permer } from "@imperial/commons";

const middleware = fp(
  async (fastify: FastifyInstance, _opts: unknown, done: () => void) => {
    fastify.addHook("preHandler", async (req) => {
      const auth =
        req.headers.authorization || req.cookies["imperial-auth"] || null;

      req.authentication_token = auth as
        | Id<"imperial_auth">
        | Id<"imperial">
        | null;

      if (auth) {
        const user = await AuthSessions.findUserByToken(auth);

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

const checkNoAuthentication = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  if (req.user) {
    reply.status(401).send({
      success: false,
      error: {
        message: "You can't be authenticated in this route",
      },
    });
  }
};

const checkAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!req.user || !permer.test(req.user.flags, "admin")) {
    reply.status(401).send({
      success: false,
      error: {
        message: "Unauthorized",
      },
    });
  }
};

export { middleware, checkAuthentication, checkNoAuthentication, checkAdmin };
