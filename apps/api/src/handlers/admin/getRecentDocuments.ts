import { desc } from "drizzle-orm/expressions";
import { db } from "../../db";
import { documents } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const getUserAdmin: FastifyImp = async (request, reply) => {
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
