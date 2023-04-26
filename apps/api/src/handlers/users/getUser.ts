import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, User } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const getUser: FastifyImp<
  {
    Params: {
      username: string;
    };
  },
  unknown,
  true
> = async (request, reply) => {
  const { username } = request.params;

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
        code: "not_found",
        message: "User not found",
      },
    });
  }

  reply.send({
    success: true,
    data: user,
  });
};
