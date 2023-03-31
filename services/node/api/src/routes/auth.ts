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
  done: () => void,
) => {
  fastify.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    login,
  );
  fastify.post(
    "/signup",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    signup,
  );
  fastify.delete(
    "/logout",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    logout,
  );

  // Password reset
  fastify.post(
    "/forgot_password",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    forgotPassword,
  );
  fastify.post(
    "/reset_password/:token",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    resetPasswordWithToken,
  );
  fastify.post(
    "/reset_password",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    resetPassword,
  );

  done();
};
