import { InferModel } from "drizzle-orm";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const getMe: FastifyImp<
  {},
  Omit<InferModel<typeof users>, "password">,
  true
> = async (request, reply) => {
  const { password, ...userWithoutPassword } = request.user;

  reply.send({
    success: true,
    data: userWithoutPassword,
  });
};
