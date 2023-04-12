import { Id } from "@imperial/commons";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";

export const logout: FastifyImp = async (request, reply) => {
  const token = request.authentication_token;

  if (!token?.startsWith("imperial_auth_")) {
    return reply.status(400).send({
      success: false,
      error: {
        message: "You can not log out an API token",
      },
    });
  }

  await AuthSessions.deleteDeviceByAuthToken(token as Id<"imperial_auth">);

  reply.status(204).send();
};
