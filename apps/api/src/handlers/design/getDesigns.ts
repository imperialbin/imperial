import { Theme } from "@imperial/commons";
import { FastifyImp } from "../../types";

export const getDesign: FastifyImp<{}, Theme[]> = async (request, reply) => {
  reply.status(413).send({
    success: false,
    error: {
      code: "not_implemented",
      message: "Not implemented",
    },
  });
};
