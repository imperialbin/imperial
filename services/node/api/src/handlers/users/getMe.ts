import { FastifyImp } from "../../types";

export const getMe: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
