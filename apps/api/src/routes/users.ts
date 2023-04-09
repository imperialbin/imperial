import { FastifyInstance } from "fastify";
import { deleteMe } from "../handlers/users/deleteMe";
import { deleteMeDevices } from "../handlers/users/deleteMeDevice";
import { getMe } from "../handlers/users/getMe";
import { getMeDevices } from "../handlers/users/getMeDevices";
import { getRecentDocuments } from "../handlers/users/getRecentDocuments";
import { getUser } from "../handlers/users/getUser";
import { patchMe } from "../handlers/users/patchMe";
import { regenerateAPIToken } from "../handlers/users/regenerateAPIToken";
import { searchUser } from "../handlers/users/searchUser";
import { upgradeMe } from "../handlers/users/upgrade";
import { RP } from "../types";
import { checkAuthentication } from "../modules/middleware";

export const usersRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.addHook("preHandler", checkAuthentication);

  fastify.get<RP<typeof getMe>>("/@me", getMe);
  fastify.patch<RP<typeof patchMe>>("/@me", patchMe);
  fastify.get<RP<typeof getRecentDocuments>>("/@me/recent", getRecentDocuments);
  fastify.get<RP<typeof getMeDevices>>("/@me/devices", getMeDevices);
  fastify.patch<RP<typeof upgradeMe>>("/@me/upgrade", upgradeMe);

  // This is a post because we confirm the password
  fastify.post<RP<typeof deleteMe>>("/@me/delete", deleteMe);
  fastify.post<RP<typeof deleteMeDevices>>("/@me/devices", deleteMeDevices);
  fastify.post<RP<typeof regenerateAPIToken>>(
    "/@me/regenerate_api_token",
    {
      config: {
        rateLimit: { max: 10 },
      },
    },
    regenerateAPIToken,
  );

  fastify.get<RP<typeof getUser>>(
    "/:username",
    {
      config: {
        rateLimit: { max: 50 },
      },
    },
    getUser,
  );
  fastify.get<RP<typeof searchUser>>(
    "/search/:username",
    {
      config: {
        rateLimit: { max: 50 },
      },
    },
    searchUser,
  );

  done();
};
