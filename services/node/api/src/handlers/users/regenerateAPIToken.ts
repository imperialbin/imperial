import { FastifyImp } from "../../types";

export const regenerateAPIToken: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
