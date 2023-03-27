import { FastifyImp } from "../../types";

export const patchMe: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
