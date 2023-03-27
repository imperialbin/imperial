import { FastifyInstance } from "fastify";
import { createDocument } from "../handlers/document/createDocument";

export const documentRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) => {
  fastify.post("/", createDocument);

  done();
};
