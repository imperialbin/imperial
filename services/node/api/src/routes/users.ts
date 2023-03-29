import { FastifyInstance } from "fastify";
import { deleteMe } from "../handlers/users/deleteMe";
import { getMe } from "../handlers/users/getMe";
import { getRecentDocuments } from "../handlers/users/getRecentDocuments";
import { getUser } from "../handlers/users/getUser";
import { patchMe } from "../handlers/users/patchMe";
import { regenerateAPIToken } from "../handlers/users/regenerateAPIToken";
import { searchUser } from "../handlers/users/searchUser";

export const usersRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) => {
  fastify.get("/@me", getMe);
  fastify.get("/@me/recent", getRecentDocuments);
  fastify.get("/:username", getUser);
  fastify.get("/search/:username", searchUser);
  fastify.patch("/@me", patchMe);

  // This is a post because we confirm the password
  fastify.post("/@me/delete", deleteMe);
  fastify.post("/@me/regenerate_api_token", regenerateAPIToken);

  done();
};
