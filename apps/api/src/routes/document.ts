import { FastifyInstance } from "fastify";
import { createDocument } from "../handlers/document/createDocument";
import { deleteDocument } from "../handlers/document/deleteDocument";
import { getDocument } from "../handlers/document/getDocument";
import { patchDocument } from "../handlers/document/patchDocument";

export const documentRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.post("/", createDocument);
  fastify.get("/:id", getDocument);
  fastify.delete("/:id", deleteDocument);
  fastify.patch("/", patchDocument);

  done();
};
