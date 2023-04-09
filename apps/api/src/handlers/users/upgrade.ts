import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { memberPlusTokens, users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { permer } from "@imperial/commons";
import { Id } from "@imperial/commons";

export const upgradeMe: FastifyImp<
  {
    Body: { token: Id<"member_plus"> };
  },
  unknown,
  true
> = async (request, reply) => {
  if (!request.body.token) {
    reply.status(400).send({
      success: false,
      error: {
        message: "Invalid token",
      },
    });
  }

  const token =
    (
      await db
        .select()
        .from(memberPlusTokens)
        .where(eq(memberPlusTokens.id, request.body.token))
    )[0] ?? null;

  if (!token) {
    reply.status(400).send({
      success: false,
      error: {
        message: "Invalid token",
      },
    });
  }

  await db
    .update(users)
    .set({
      flags: permer.add(request.user.flags, ["member-plus"]),
    })
    .where(eq(users.id, request.user.id));

  await db.delete(memberPlusTokens).where(eq(memberPlusTokens.id, token.id));

  reply.status(204).send();
};
