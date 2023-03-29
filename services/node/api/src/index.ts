import fastify from "fastify";
import { setupDB } from "./db";
import { checkAuthentication, middleware } from "./modules/middleware";
import { authRoutes } from "./routes/auth";
import { documentRoutes } from "./routes/document";
import { oAuthRoutes } from "./routes/oauth";
import { usersRoutes } from "./routes/users";
import { env } from "./utils/env";
import { Logger } from "./utils/logger";
import { setupRedis } from "./utils/redis";

const server = fastify({
  bodyLimit: 5000000,
});
setupDB();
setupRedis();

const API_VERSION = "v1";

server.register(middleware);
server.register(usersRoutes, { prefix: `/${API_VERSION}/users` });
server.register(documentRoutes, { prefix: `/${API_VERSION}/document` });
server.register(authRoutes, { prefix: `/${API_VERSION}/auth` });
server.register(oAuthRoutes, { prefix: `/${API_VERSION}/oauth` });

server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

server.setErrorHandler((error, request, reply) => {
  Logger.error("SERVER", error.message);
  reply.code(500).send({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
});

server.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    Logger.error("INIT", err.message);
    process.exit(1);
  }

  Logger.info("INIT", `Server listening at ${address}`);
});
