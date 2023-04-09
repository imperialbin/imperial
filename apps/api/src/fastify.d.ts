/* eslint-disable @typescript-eslint/consistent-type-definitions */
import "src/fastify";
import { InferModel } from "drizzle-orm";
import { users } from "./db/schemas";
import { APIError } from "./types";
import { RequestGenericInterface } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    // Typescript isn't very smart in between transferring the types from ImpFastify and FastifyRequest
    user: any;
  }
  interface FastifyReply {
    error: (code: number, error: APIError) => FastifyReply;
  }
}
