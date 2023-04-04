import { InferModel } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { Discord } from "../../utils/discord";

export const discord: FastifyImp<
  unknown,
  unknown,
  {
    code: string;
  }
> = async (request, reply) => {
  if (!request.user) {
    return;
  }

  const { code } = request.query;
  const accessToken = await Discord.getAccessToken(code);

  if ("error" in accessToken) {
    return reply.status(401).send({
      success: false,
      error: {
        message: accessToken.error_description,
      },
    });
  }

  const userInfo = await Discord.getUserWithToken(
    `${accessToken.token_type} ${accessToken.access_token}`
  );

  if (!userInfo) {
    return reply.status(500).send({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }

  await db
    .update(users)
    .set({
      discord: userInfo,
    })
    .where(eq(users.id, request.user.id));

  reply.status(204).send();
};