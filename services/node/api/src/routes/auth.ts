import { FastifyInstance } from "fastify";
import { login } from "../handlers/auth/login";
import { logout } from "../handlers/auth/logout";
import { signup } from "../handlers/auth/signup";

export const authRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) => {
  fastify.post("/login", login);
  fastify.post("/signup", signup);
  fastify.delete("/logout", logout);

  done();
};
