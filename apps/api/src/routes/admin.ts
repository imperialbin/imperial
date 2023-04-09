import { FastifyInstance } from "fastify";
import { banUser } from "../handlers/admin/banUser";
import { createMemberPlusToken } from "../handlers/admin/createMemberPlusToken";
import { getUserAdmin } from "../handlers/admin/getUser";
import { getRecentDocuments } from "../handlers/users/getRecentDocuments";
import { patchUser } from "../handlers/admin/patchUser";
import { FastifyImp, RP } from "../types";
import { checkAdmin } from "../modules/middleware";

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
  fastify.delete<RP<typeof banUser>>("/ban/:id", banUser);

  done();
};
