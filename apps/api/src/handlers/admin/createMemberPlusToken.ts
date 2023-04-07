import { db } from "../../db";
import { memberPlusTokens } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { permer } from "@imperial/commons";
import { pika } from "@imperial/commons";

export const createMemberPlusToken: FastifyImp = async (request, reply) => {
  if (!request.user || !permer.test(request.user.flags, "admin")) {
    return reply.status(403).send({
      success: false,
      error: {
        message: "You are not an admin",
      },
    });
  }

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
