import { InferModel } from "drizzle-orm";
import { users } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { env } from "../../utils/env";

export const github: FastifyImp<
  unknown,
  unknown,
  {
    code: string;
  }
> = async (request, reply) => {
  if (!request.user) return;

  const code = request.query.code;

  const accessTokenRequest = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  )
    .then((res) => res.json())
    .catch(() => {
      reply.status(500).send({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    });

  console.log(accessTokenRequest);
  

  reply.send({
    success: true,
    data: code,
  });
};
