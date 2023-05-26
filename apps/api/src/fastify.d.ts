/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Id } from "@imperial/commons";
import "fastify";
import { APIError } from "./types";

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
