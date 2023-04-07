/* eslint-disable @typescript-eslint/consistent-type-definitions */
import "src/fastify";
import { InferModel } from "drizzle-orm";
import { users } from "./db/schemas";
import { APIError } from "./types";

declare module "fastify" {
  interface FastifyRequest {
    user: InferModel<typeof users> | null;
  }
  interface FastifyReply {
    error: (code: number, error: APIError) => FastifyReply;
  }
}
