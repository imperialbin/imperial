import { AUTH_TOKEN, CREATED_USER } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  const resNoAuth = await server.inject({
    method: "PATCH",
    url: "/v1/users/@me",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const res = await server.inject({
    method: "PATCH",
    url: "/v1/users/@me",
    payload: {
      email: "test-changed@impb.in",
      settings: {
        clipboard: true,
      },
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data.id).toBe(CREATED_USER.id);
  expect(res.json().data.username).toBe(CREATED_USER.username);
  expect(res.json().data.email).toBe("test-changed@impb.in");
};
