import { FastifyInstance } from "fastify";
import { forgotPassword } from "../handlers/auth/forgotPassword";
import { login } from "../handlers/auth/login";
import { logout } from "../handlers/auth/logout";
import { resetPassword } from "../handlers/auth/resetPassword";
import { resetPasswordWithToken } from "../handlers/auth/resetPasswordWithToken";
import { signup } from "../handlers/auth/signup";
import {
  checkAuthentication,
  checkNoAuthentication,
} from "../modules/middleware";
import { RP } from "../types";

export const authRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.post<RP<typeof login>>(
    "/login",
    {
      preHandler: checkNoAuthentication,
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    login,
  );

  fastify.post<RP<typeof signup>>(
    "/signup",
    {
      preHandler: checkNoAuthentication,
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    signup,
  );

  fastify.delete<RP<typeof logout>>(
    "/logout",
    {
      preHandler: checkAuthentication,
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    logout,
  );

  // Password reset
  fastify.post<RP<typeof forgotPassword>>(
    "/forgot",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    forgotPassword,
  );

  fastify.post<RP<typeof resetPasswordWithToken>>(
    "/reset_password/token",
    {
      config: {
        rateLimit: {
          max: 10,
        },
      },
    },
    resetPasswordWithToken,
  );

  fastify.post<RP<typeof resetPassword>>(
    "/reset_password",
    {
      preHandler: checkAuthentication,
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
