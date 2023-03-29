import { FastifyInstance } from "fastify";
import { forgotPassword } from "../handlers/auth/forgotPassword";
import { login } from "../handlers/auth/login";
import { logout } from "../handlers/auth/logout";
import { resetPassword } from "../handlers/auth/resetPassword";
import { resetPasswordWithToken } from "../handlers/auth/resetPasswordWithToken";
import { signup } from "../handlers/auth/signup";

export const authRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) => {
  fastify.post("/login", login);
  fastify.post("/signup", signup);
  fastify.delete("/logout", logout);

  // Password reset
  fastify.post("/forgot_password", forgotPassword);
  fastify.post("/reset_password/:token", resetPasswordWithToken);
  fastify.post("/reset_password", resetPassword);

  done();
};
