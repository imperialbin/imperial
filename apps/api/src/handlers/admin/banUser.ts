import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { Id, permer } from "@imperial/commons";
import { AuthSessions } from "../../utils/authSessions";

export const banUser: FastifyImp<
  {},
  unknown,
  unknown,
  {
    id: Id<"user">;
  }
> = async (request, reply) => {
  if (!request.user || !permer.test(request.user.flags, "admin")) {
    return reply.status(403).send({
      success: false,
      error: {
        message: "You are not an admin",
      },
    });
  }

  const { id } = request.params;
  const user =
    (await db.select().from(users).where(eq(users.id, id)))[0] ?? null;

  if (!user) {
    reply.status(404).send({
      success: false,
      error: {
        message: "User not found",
      },
    });
  }

  await db
    .update(users)
    .set({
      banned: true,
    })
    .where(eq(users.id, id));

  await AuthSessions.deleteAllSessionsForUser(user.id);

  reply.status(204).send();
};
