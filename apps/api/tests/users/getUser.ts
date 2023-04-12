import { AUTH_TOKEN, BUDDY_USER, CREATED_USER } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  const resNoAuth = await server.inject({
    method: "GET",
    url: `/v1/users/${BUDDY_USER.username}`,
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    message: "Unauthorized",
  });

  const resNoUser = await server.inject({
    method: "GET",
    url: `/v1/users/${BUDDY_USER.username}bad`,
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resNoUser.statusCode).toBe(404);
  expect(resNoUser.json()).toHaveProperty("success", false);
  expect(resNoUser.json()).toHaveProperty("error", {
    message: "User not found",
  });

  const res = await server.inject({
    method: "GET",
    url: `/v1/users/${BUDDY_USER.username}`,
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data).toBe({
    id: BUDDY_USER.id,
    username: BUDDY_USER.username,
    documents_made: 0,
    flags: BUDDY_USER.flags,
    icon: BUDDY_USER.icon,
  });
};
