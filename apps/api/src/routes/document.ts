import { FastifyInstance } from "fastify";
import { createDocument } from "../handlers/document/createDocument";
import { deleteDocument } from "../handlers/document/deleteDocument";
import { getDocument } from "../handlers/document/getDocument";
import { patchDocument } from "../handlers/document/patchDocument";
import { checkAuthentication } from "../modules/middleware";
import { RP } from "../types";

export const documentRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.post<RP<typeof createDocument>>("/", createDocument);
  fastify.get<RP<typeof getDocument>>("/:id", getDocument);
  fastify.delete<RP<typeof deleteDocument>>(
    "/:id",
    { preHandler: checkAuthentication },
    deleteDocument,
  );
  fastify.patch<RP<typeof patchDocument>>(
    "/",
    {
      preHandler: checkAuthentication,
    },
    patchDocument,
  );

  done();
};
