import { FastifyImp } from "../../types";

export const getUser: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
