import { AUTH_TOKEN, BUDDY_USER } from "../auth/register";
import { server } from "../index.test";

export default async () => {
  const resNoAuth = await server.inject({
    method: "GET",
    url: `/v1/users/search/${BUDDY_USER.username}`,
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const resNoUser = await server.inject({
    method: "GET",
    url: `/v1/users/search/${BUDDY_USER.username}badwetrerwgt`,
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resNoUser.statusCode).toBe(200);
  expect(resNoUser.json()).toHaveProperty("success", true);
  expect(resNoUser.json()).toHaveProperty("data");
  expect(resNoUser.json().data).toHaveLength(0);

  const res = await server.inject({
    method: "GET",
    url: `/v1/users/search/${BUDDY_USER.username}`,
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data.length).toBeGreaterThanOrEqual(1);
};
