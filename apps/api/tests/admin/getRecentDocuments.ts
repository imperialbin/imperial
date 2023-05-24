import { AUTH_TOKEN } from "../auth/register";
import { ADMIN_AUTH_TOKEN, server } from "../index.test";

export default async () => {
  // Make sure that normal users dont have access
  const resNoAuth = await server.inject({
    method: "GET",
    url: "/v1/admin/recent",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be an admin to access this route",
  });

  const resNoAdmin = await server.inject({
    method: "GET",
    url: "/v1/admin/recent",
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resNoAdmin.statusCode).toBe(401);
  expect(resNoAdmin.json()).toHaveProperty("success", false);
  expect(resNoAdmin.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be an admin to access this route",
  });

  const res = await server.inject({
    method: "GET",
    url: "/v1/admin/recent",
    headers: {
      authorization: ADMIN_AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
};
