import { Id, pika } from "@imperial/commons";
import { db } from "../../db";
import { memberPlusTokens } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const createMemberPlusToken: FastifyImp<
  {},
  {
    token: Id<"member_plus">;
  },
  true
> = async (request, reply) => {
  const token = pika.gen("member_plus");

  await db.insert(memberPlusTokens).values({
    id: token,
  });

  reply.send({
    success: true,
    data: {
      token,
    },
  });
};
