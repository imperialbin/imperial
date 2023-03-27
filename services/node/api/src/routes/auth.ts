import { FastifyInstance } from "fastify";
import { login } from "../handlers/auth/login";
import { signup } from "../handlers/auth/signup";

export const authRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) => {
  fastify.post("/login", login);
  fastify.post("/signup", signup);

  done();
};
