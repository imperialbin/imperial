import { FastifyInstance } from "fastify";
import { createMemberPlusToken } from "../handlers/admin/createMemberPlusToken";
import { getUserAdmin } from "../handlers/admin/getUser";
import { patchUser } from "../handlers/admin/patchUser";
import { getRecentDocuments } from "../handlers/users/getRecentDocuments";
import { checkAdmin } from "../modules/middleware";
import { RP } from "../types";

export const adminRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.addHook("preHandler", checkAdmin);

  fastify.get<RP<typeof getUserAdmin>>("/:id", getUserAdmin);
  fastify.get<RP<typeof getRecentDocuments>>("/recent", getRecentDocuments);
  fastify.patch<RP<typeof patchUser>>("/:id", patchUser);
  fastify.post<RP<typeof createMemberPlusToken>>(
    "/member_plus",
    createMemberPlusToken,
  );

  done();
};
