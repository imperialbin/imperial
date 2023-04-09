import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";

export const logout: FastifyImp = async (request, reply) => {
  const token =
    request.headers.authorization ??
    request.cookies["imperial-auth"] ??
    ("" as string);
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
