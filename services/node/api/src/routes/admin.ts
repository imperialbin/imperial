import { FastifyInstance } from "fastify";
import { banUser } from "../handlers/admin/banUser";
import { getUserAdmin } from "../handlers/admin/getUser";

export const adminRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.get("/:username", getUserAdmin);
  fastify.delete("/ban/:username", banUser);

  done();
};
