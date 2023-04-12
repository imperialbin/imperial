import { AUTH_TOKEN, CREATED_USER } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  const resNoAuth = await server.inject({
    method: "GET",
    url: "/v1/users/@me",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    message: "Unauthorized",
  });

  const res = await server.inject({
    method: "GET",
    url: "/v1/users/@me",
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data.id).toBe(CREATED_USER.id);
  expect(res.json().data.username).toBe(CREATED_USER.username);
  expect(res.json().data.email).toBe(CREATED_USER.email);
};
