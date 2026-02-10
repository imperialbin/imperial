import cors from "@fastify/cors";
import * as Sentry from "@sentry/node";
import fastify from "fastify";
import { setupDB } from "./db";
import { middleware } from "./modules/middleware";
import { adminRoutes } from "./routes/admin";
import { authRoutes } from "./routes/auth";
import { documentRoutes } from "./routes/document";
import { githubRoutes } from "./routes/github";
import { oAuthRoutes } from "./routes/oauth";
import { stripeRoutes } from "./routes/stripe";
import { usersRoutes } from "./routes/users";
import { env } from "./utils/env";
import { Logger } from "./utils/logger";
import { Redis } from "./utils/redis";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: env.SENTRY_ENVIRONMENT,
});

export const main = async () => {
  const server = fastify({
    bodyLimit: 5000000,
    trustProxy: env.PRODUCTION
      ? ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.1"]
      : true,
  });

  await setupDB();
  await Redis.initialize();

  const API_VERSION = "v1";

  server.register(middleware);
  server.register(cors, {
    maxAge: 600,
    origin: [
      "https://imperialb.in",
      "https://www.imperialb.in",
      "https://staging.imperialb.in",
      "https://app.imperialb.in",
      env.PRODUCTION ? "" : "http://localhost:3000",
    ].filter(Boolean),
    credentials: true,
  });
  server.register(import("@fastify/cookie"), {
    secret: env.COOKIE_SIGNER,
    parseOptions: {
      httpOnly: true,
      secure: env.PRODUCTION,
      sameSite: env.PRODUCTION ? "lax" : "none",
      path: "/",
      domain: ".impb.in",
      // New date 6 months from now
      expires: new Date(Date.now() + 15778476000),
    },
  });
  await server.register(import("@fastify/rate-limit"), {
    global: true,
    max: 500,
    timeWindow: "1 minute",
    keyGenerator(request) {
      return (request?.user?.id ??
        request.headers["x-real-ip"] ??
        request.headers["x-client-ip"] ??
        request.headers["x-forwarded-for"] ??
        request.ip) as string;
    },
  });
  await server.register(import("fastify-raw-body"), {
    global: false,
    encoding: false,
    runFirst: true,
  });

  server.get("/", async (_, reply) => {
    reply.send({
      success: true,
      data: {
        message: "Welcome to Imperial API",
      },
    });
  });
  server.get("/v1", async (_, reply) => {
    reply.send({
      success: true,
      data: {
        message: "Welcome to Imperial API",
        version: "1",
        documentation: "https://docs.imperialb.in/v1",
      },
    });
  });
  server.register(usersRoutes, { prefix: `/${API_VERSION}/users` });
  server.register(documentRoutes, { prefix: `/${API_VERSION}/document` });
  server.register(documentRoutes, { prefix: `/${API_VERSION}/documents` }); // Alias
  server.register(authRoutes, { prefix: `/${API_VERSION}/auth` });
  server.register(oAuthRoutes, { prefix: `/${API_VERSION}/oauth` });
  server.register(adminRoutes, { prefix: `/${API_VERSION}/admin` });
  server.register(stripeRoutes, { prefix: `/${API_VERSION}/stripe` });
  server.register(githubRoutes, { prefix: `/${API_VERSION}/github` });

  server.setNotFoundHandler((_, reply) => {
    reply.code(404).send({
      success: false,
      error: {
        message: "Route not found",
      },
    });
  });

  server.setErrorHandler((error, _, reply) => {
    if ((error.statusCode ?? 500) >= 500) {
      Logger.error("SERVER", error.message);
      Sentry.captureException(error);
    }

    reply.code(error.statusCode ?? 500).send({
      success: false,
      error: {
        message:
          (error.statusCode ?? 500) >= 500
            ? "Internal server error"
            : error.message,
      },
    });
  });

  server.listen({ host: env.HOST, port: env.PORT }, (err, address) => {
    if (err) {
      Logger.error("INIT", err.message);
      process.exit(1);
    }

    Logger.info("INIT", `Server listening at ${address}`);
  });

  return server;
};
