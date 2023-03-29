import { sql } from "drizzle-orm";
import { ilike } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp, User } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const searchUser: FastifyImp<
  {},
  unknown,
  unknown,
  {
    username: string;
  }
> = async (request, reply) => {
  const username = request.params.username;

  const likeUsers: User[] = await db
    .select(USER_PUBLIC_OBJECT)
    .from(users)
    .where(sql`${ilike(users.username, `%${username}%`)}`);

  reply.send({
    success: true,
    data: likeUsers,
  });
};
