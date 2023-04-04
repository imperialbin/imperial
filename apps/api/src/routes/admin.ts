import { FastifyInstance } from "fastify";
import { banUser } from "../handlers/admin/banUser";
import { createMemberPlusToken } from "../handlers/admin/createMemberPlusToken";
import { getUserAdmin } from "../handlers/admin/getUser";
import { getRecentDocuments } from "../handlers/users/getRecentDocuments";

export const adminRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.get("/:username", getUserAdmin);
  fastify.get("/recent", getRecentDocuments);
  fastify.post("/member_plus", createMemberPlusToken);
  fastify.delete("/ban/:username", banUser);

  done();
};