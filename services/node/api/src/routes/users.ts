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

export const usersRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.get("/@me", getMe);
  fastify.patch("/@me", patchMe);
  fastify.get("/@me/recent", getRecentDocuments);
  fastify.get("/@me/devices", getMeDevices);
  fastify.patch("/@me/upgrade", upgradeMe);

  // This is a post because we confirm the password
  fastify.post("/@me/delete", deleteMe);
  fastify.post("/@me/devices", deleteMeDevices);
  fastify.post(
    "/@me/regenerate_api_token",
    {
      config: {
        rateLimit: { max: 10 },
      },
    },
    regenerateAPIToken,
  );

  fastify.get(
    "/:username",
    {
      config: {
        rateLimit: { max: 50 },
      },
    },
    getUser,
  );
  fastify.get(
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
