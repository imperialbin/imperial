import { Id } from "@imperial/commons";
import { themes, users } from "@imperial/internal";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../../db";
import { FastifyImp } from "../../types";
import { USER_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const deleteTheme: FastifyImp<
  {
    Params: {
      id: Id<"theme">;
    };
  },
  unknown,
  true
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

  if (theme.creator?.id !== request.user.id) {
    return reply.status(403).send({
      success: false,
      error: {
        code: "bad_auth",
        message: "You do not have permission to delete this theme",
      },
    });
  }

  await db.delete(themes).where(eq(themes.id, themeId));

  return reply.status(204);
};
