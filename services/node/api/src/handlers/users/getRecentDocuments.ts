import { FastifyImp } from "../../types";

export const getRecentDocuments: FastifyImp = async (request, reply) => {
  reply.send({
    success: true,
    data: {
      message: "what",
    },
  });
};
