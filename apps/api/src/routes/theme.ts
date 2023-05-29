import { FastifyInstance } from "fastify";
import { createTheme } from "../handlers/theme/createTheme";
import { deleteTheme } from "../handlers/theme/deleteTheme";
import { getTheme } from "../handlers/theme/getTheme";
import { getThemes } from "../handlers/theme/getThemes";
import { patchTheme } from "../handlers/theme/patchTheme";
import { RP } from "../types";

export const themeRoutes = (
  fastify: FastifyInstance,
  _: unknown,
  done: () => void,
) => {
  fastify.get<RP<typeof getTheme>>("/:id", getTheme);
  fastify.get<RP<typeof getTheme>>("/", getThemes);

  fastify.post<RP<typeof createTheme>>("/", createTheme);
  fastify.patch<RP<typeof patchTheme>>("/", patchTheme);
  fastify.delete<RP<typeof deleteTheme>>("/:id", deleteTheme);

  done();
};
