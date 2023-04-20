import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { Discord } from "../../utils/discord";

export const discord: FastifyImp<
  {
    Querystring: {
      code: string;
    };
  },
  unknown,
  true
> = async (request, reply) => {
  const { code } = request.query;
  const accessToken = await Discord.getAccessToken(code);

  if ("error" in accessToken) {
    return reply.status(401).send({
      success: false,
      error: {
        code: "bad_auth",
        message: accessToken.error_description,
      },
    });
  }

  const userInfo = await Discord.getUserWithToken(
    `${accessToken.token_type} ${accessToken.access_token}`,
  );

  if (!userInfo) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
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
