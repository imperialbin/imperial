import { desc } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { permer } from "../../utils/permissions";

export const getUserAdmin: FastifyImp = async (request, reply) => {
  if (!request.user || !permer.test(request.user.flags, "admin")) {
    reply.status(403).send({
      success: false,
      error: {
        message: "You are not an admin",
      },
    });
  }

  const recentDocuments = await db
    .select()
    .from(documents)
    .limit(15)
    .orderBy(desc(documents.created_at));

  reply.send({
    success: true,
    data: recentDocuments,
  });
};
