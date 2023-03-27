import fastify from "fastify";
import { setupDB } from "./db";
import { documentRoutes } from "./routes/document";
import { usersRoutes } from "./routes/users";
import { env } from "./utils/env";

const server = fastify({
  bodyLimit: 5000000,
});
setupDB();

const API_VERSION = "v1";

server.register(usersRoutes, { prefix: `/${API_VERSION}/users` });
server.register(documentRoutes, { prefix: `/${API_VERSION}/document` });
server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

server.setErrorHandler((error, request, reply) => {
  console.error(error);
  reply.code(500).send({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
});

server.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
