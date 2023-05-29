import { Id, Theme } from "@imperial/commons";
import { themes, users } from "@imperial/internal";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../../db";
import { FastifyImp } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const getDesign: FastifyImp<
  {
    Params: {
      id: Id<"theme">;
    };
  },
  Theme
> = async (request, reply) => {
  const themeId = request.params.id;

  const theme =
    (
      await db
        .select({
          ...getTableColumns(themes),
          creator: USER_PUBLIC_OBJECT,
        })
        .from(themes)
        .leftJoin(users, eq(themes.creator, users.id))
        .where(eq(themes.id, themeId))
    )[0] ?? null;

  if (!theme) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "Theme not found",
      },
    });
  }

  return reply.status(200).send({
    success: true,
    data: theme,
  });
};
