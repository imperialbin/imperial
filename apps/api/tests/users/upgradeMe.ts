import { MEMBER_PLUS_TOKEN } from "../admin/createMemberPlusToken";
import { AUTH_TOKEN } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  const resNoAuth = await server.inject({
    method: "PATCH",
    url: "/v1/users/@me/upgrade",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const resBadToken = await server.inject({
    method: "PATCH",
    url: "/v1/users/@me/upgrade",
    payload: {
      token: "nope",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resBadToken.statusCode).toBe(400);
  expect(resBadToken.json()).toHaveProperty("success", false);
  expect(resBadToken.json()).toHaveProperty("error", {
    code: "bad_request",
    message: "Invalid token",
  });

  const res = await server.inject({
    method: "PATCH",
    url: "/v1/users/@me/upgrade",
    payload: {
      token: MEMBER_PLUS_TOKEN,
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(204);
};
