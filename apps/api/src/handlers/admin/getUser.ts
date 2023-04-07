import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, User } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";
import { permer } from "@imperial/commons";

export const getUserAdmin: FastifyImp<
  {},
  unknown,
  unknown,
  {
    username: string;
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

  const { username } = request.params;
  const user =
    (await db.select().from(users).where(eq(users.username, username)))[0] ??
    null;

  if (!user) {
    reply.status(404).send({
      success: false,
      error: {
        message: "User not found",
      },
    });
  }

  reply.send({
    success: true,
    data: user,
  });
};
