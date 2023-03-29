import bcrypt from "bcrypt";
import { eq } from "drizzle-orm/expressions";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";

export const logout: FastifyImp = async (request, reply) => {
  if (!request.user) {
    return;
  }

  // This is for sure going to be not undefined/null because they wouldn't be able to get passed the checkAuth middleware
  const token = request.headers.authorization as string;
  if (!token.startsWith("imperial_auth_")) {
    reply.status(400).send({
      success: false,
      error: {
        message: "You can not log out an API token",
      },
    });
  }

  await AuthSessions.deleteDeviceByAuthToken(token);

  reply.status(204).send();
};
