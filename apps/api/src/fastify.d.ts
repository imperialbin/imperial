/* eslint-disable @typescript-eslint/consistent-type-definitions */
import "src/fastify";
import { InferModel } from "drizzle-orm";
import { users } from "./db/schemas";
import { APIError } from "./types";
import { RequestGenericInterface } from "fastify";
import { Id } from "@imperial/commons";

declare module "fastify" {
  interface FastifyRequest {
    // Typescript isn't very smart in between transferring the types from ImpFastify and FastifyRequest
    user: any;
    authentication_token: Id<"imperial_auth"> | Id<"imperial"> | null;
  }
  interface FastifyReply {
    error: (code: number, error: APIError) => FastifyReply;
  }
}
