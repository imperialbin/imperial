import "fastify";
import { InferModel } from "drizzle-orm";
import { users } from "./src/db/schemas";
import { APIError } from "./src/types";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyRequest {
    user: InferModel<typeof users> | null;
  }
  interface FastifyReply {
    error: (code: number, error: APIError) => FastifyReply;
  }
}
