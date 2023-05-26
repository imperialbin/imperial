import { FastifyInstance } from "fastify";
import { discord } from "../handlers/oauth/discord";
import { github } from "../handlers/oauth/github";
import { env } from "../utils/env";
import { RP } from "../types";
import { checkAuthentication } from "../modules/middleware";

export const oAuthRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.get<RP<typeof github>>(
    "/github/callback",
    {
      preHandler: checkAuthentication,
    },
    github,
  );
  fastify.get<RP<typeof discord>>(
    "/discord/callback",
    {
      preHandler: checkAuthentication,
    },
    discord,
  );

  // Redirects
  fastify.get("/github", (_, reply) =>
    reply.redirect(
      302,
      `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.FRONTEND_URL}/auth/github&scope=gist read:user`,
    ),
  );

  fastify.get("/discord", (_, reply) =>
    reply.redirect(
      302,
      `https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&redirect_uri=${env.FRONTEND_URL}/auth/discord&response_type=code&scope=guilds.join%20identify%20guilds`,
    ),
  );

  done();
};
