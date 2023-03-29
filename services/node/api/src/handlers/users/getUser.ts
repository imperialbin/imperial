import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, User } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const getUser: FastifyImp<
  {},
  unknown,
  unknown,
  {
    username: string;
  }
> = async (request, reply) => {
  const username = request.params.username;

  const user: User =
    (
      await db
        .select(USER_PUBLIC_OBJECT)
        .from(users)
        .where(eq(users.username, username))
    )[0] ?? null;

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
