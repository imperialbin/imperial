import { AUTH_TOKEN, BUDDY_AUTH_TOKEN } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  const resNoAuth = await server.inject({
    method: "POST",
    url: "/v1/users/@me/delete",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const resBadPassword = await server.inject({
    method: "POST",
    url: "/v1/users/@me/delete",
    payload: {
      password: "12345678",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resBadPassword.statusCode).toBe(400);
  expect(resBadPassword.json()).toHaveProperty("success", false);
  expect(resBadPassword.json()).toHaveProperty("error", {
    code: "bad_request",
    message: "Invalid password",
  });

  const res = await server.inject({
    method: "POST",
    url: "/v1/users/@me/delete",
    payload: {
      password: "123456789",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(204);

  const resBuddy = await server.inject({
    method: "POST",
    url: "/v1/users/@me/delete",
    payload: {
      password: "123456789",
    },
    headers: {
      authorization: BUDDY_AUTH_TOKEN,
    },
  });

  expect(resBuddy.statusCode).toBe(204);
};
