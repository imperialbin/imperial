import { FastifyImp } from "../../types";

export const deleteMe: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
