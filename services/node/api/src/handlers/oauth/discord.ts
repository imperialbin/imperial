import { InferModel } from "drizzle-orm";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const discord: FastifyImp<
  Omit<InferModel<typeof users>, "password">
> = async (request, reply) => {
  if (!request.user) return;

  const { password, ...userWithoutPassword } = request.user;

  reply.send({
    success: true,
    data: userWithoutPassword,
  });
};
