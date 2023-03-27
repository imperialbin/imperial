import { FastifyImp } from "../../types";

export const searchUser: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
