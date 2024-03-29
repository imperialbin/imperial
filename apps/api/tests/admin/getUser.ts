import { ADMIN_AUTH_TOKEN, AUTH_TOKEN, BUDDY_USER } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  // Make sure that normal users dont have access
  const resNoAuth = await server.inject({
    method: "GET",
    url: `/v1/admin/${BUDDY_USER.id}`,
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be an admin to access this route",
  });

  const resNoAdmin = await server.inject({
    method: "GET",
    url: `/v1/admin/${BUDDY_USER.id}`,
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

  const resWrongID = await server.inject({
    method: "GET",
    url: `/v1/admin/${BUDDY_USER.id}wrong`,
    headers: {
      authorization: ADMIN_AUTH_TOKEN,
    },
  });

  expect(resWrongID.statusCode).toBe(404);
  expect(resWrongID.json()).toHaveProperty("success", false);
  expect(resWrongID.json()).toHaveProperty("error", {
    code: "not_found",
    message: "User not found",
  });

  const res = await server.inject({
    method: "GET",
    url: `/v1/admin/${BUDDY_USER.id}`,
    headers: {
      authorization: ADMIN_AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data).toHaveProperty("banned", true);
  expect(res.json().data).toHaveProperty("email", BUDDY_USER.email);
  expect(res.json().data).toHaveProperty("id", BUDDY_USER.id);
  expect(res.json().data).toHaveProperty("username", BUDDY_USER.username);
};
