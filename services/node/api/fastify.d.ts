import { FastifyPluginCallback, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { APIError, SelfUser } from "./src/types";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyRequest {
    user: SelfUser | null;
  }
  interface FastifyReply {
    error: (code: number, error: APIError) => FastifyReply;
  }
}
