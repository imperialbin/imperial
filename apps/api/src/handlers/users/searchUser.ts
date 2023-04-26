import { sql } from "drizzle-orm";
import { ilike } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, User } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const searchUser: FastifyImp<
  {
    Params: {
      username: string;
    };
  },
  unknown,
  true
> = async (request, reply) => {
  const { username } = request.params;

  const likeUsers: User[] = await db
    .select(USER_PUBLIC_OBJECT)
    .from(users)
    .limit(10)
    .where(sql`${ilike(users.username, `%${username}%`)}`);

  reply.send({
    success: true,
    data: likeUsers,
  });
};
