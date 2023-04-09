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
import { confirmEmail } from "../handlers/auth/confirmEmail";
import { resendConfirmEmail } from "../handlers/auth/resendConfirmEmail";

const COMMON_CONFIG = {
  config: {
    rateLimit: {
      max: 10,
    },
  },
};

export const authRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.post<RP<typeof confirmEmail>>(
    "/confirm",
    COMMON_CONFIG,
    confirmEmail,
  );

  fastify.post<RP<typeof resendConfirmEmail>>(
    "/resend_confirm",
    COMMON_CONFIG,
    resendConfirmEmail,
  );

  fastify.post<RP<typeof login>>(
    "/login",
    {
      preHandler: checkNoAuthentication,
      config: COMMON_CONFIG.config,
    },
    login,
  );

  fastify.post<RP<typeof signup>>(
    "/signup",
    {
      preHandler: checkNoAuthentication,
      config: COMMON_CONFIG.config,
    },
    signup,
  );

  fastify.delete<RP<typeof logout>>(
    "/logout",
    {
      preHandler: checkAuthentication,
      config: COMMON_CONFIG.config,
    },
    logout,
  );

  // Password reset
  fastify.post<RP<typeof forgotPassword>>(
    "/forgot",
    COMMON_CONFIG,
    forgotPassword,
  );

  fastify.post<RP<typeof resetPasswordWithToken>>(
    "/reset_password/token",
    COMMON_CONFIG,
    resetPasswordWithToken,
  );

  fastify.post<RP<typeof resetPassword>>(
    "/reset_password",
    {
      preHandler: checkAuthentication,
      config: COMMON_CONFIG.config,
    },
    resetPassword,
  );

  done();
};
