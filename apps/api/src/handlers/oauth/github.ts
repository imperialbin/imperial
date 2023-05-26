import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { GitHub } from "../../utils/github";

export const github: FastifyImp<
  {
    Querystring: {
      code: string;
    };
  },
  unknown,
  true
> = async (request, reply) => {
  const { code } = request.query;
  const accessToken = await GitHub.getAccessToken(code);
  if ("error" in accessToken) {
    return reply.status(401).send({
      success: false,
      error: {
        code: "bad_auth",
        message: accessToken.error_description,
      },
    });
  }

  const userInfo = await GitHub.getUserWithToken(accessToken.access_token);
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
      github: {
        login: userInfo.login,
        id: userInfo.id,
        avatar_url: userInfo.avatar_url,
        gravatar_id: userInfo.gravatar_id,
        type: userInfo.type,
        name: userInfo.name,
        location: userInfo.location,
        email: userInfo.email,
        hireable: userInfo.hireable,
        bio: userInfo.bio,
        twitter_username: userInfo.twitter_username,
        public_gists: userInfo.public_gists,
        private_gists: userInfo.private_gists,
        two_factor_authentication: userInfo.two_factor_authentication,
        token: accessToken.access_token,
      },
    })
    .where(eq(users.id, request.user.id));

  reply.status(204).send();
};
