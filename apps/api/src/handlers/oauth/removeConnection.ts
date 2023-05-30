import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const removeConnection: FastifyImp<{}, unknown, true> = async (
  request,
  reply,
) => {
  const connectionType = request.url.split("/").pop() as "github" | "discord";

  if (connectionType !== "discord" && connectionType !== "github") {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Invalid connection type",
      },
    });
  }

  if (!request.user[connectionType]) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: `You don't have a ${connectionType} connection`,
      },
    });
  }

  await db
    .update(users)
    .set({
      [connectionType]: null,
    })
    .where(eq(users.id, request.user.id));

  reply.status(204).send();
};
