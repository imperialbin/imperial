import { Id } from "@imperial/commons";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const getUserAdmin: FastifyImp<
  {
    Params: {
      id: Id<"user">;
    };
  },
  {},
  true
> = async (request, reply) => {
  const { id } = request.params;
  const user =
    (await db.select().from(users).where(eq(users.id, id)))[0] ?? null;

  if (!user) {
    reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "User not found",
      },
    });
  }

  const { password, ...userWithoutPassword } = user;

  reply.send({
    success: true,
    data: userWithoutPassword,
  });
};
