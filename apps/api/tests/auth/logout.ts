import { server } from "../index.test";
import { DISPOSABLE_AUTH_TOKEN } from "./login";
import { CREATED_USER } from "./register";

export default async () => {
  // Test to make have bad credentials
  const resNoAuth = await server.inject({
    method: "DELETE",
    url: "/v1/auth/logout",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    message: "Unauthorized",
  });

  const resBadAuth = await server.inject({
    method: "DELETE",
    url: "/v1/auth/logout",
    headers: {
      Authorization: DISPOSABLE_AUTH_TOKEN + "123",
    },
  });

  expect(resBadAuth.statusCode).toBe(401);
  expect(resBadAuth.json()).toHaveProperty("success", false);
  expect(resBadAuth.json()).toHaveProperty("error", {
    message: "Unauthorized",
  });

  const resBadWithAPIToken = await server.inject({
    method: "DELETE",
    url: "/v1/auth/logout",
    headers: {
      Authorization: CREATED_USER.api_token,
    },
  });

  expect(resBadWithAPIToken.statusCode).toBe(400);
  expect(resBadWithAPIToken.json()).toHaveProperty("success", false);
  expect(resBadWithAPIToken.json()).toHaveProperty("error", {
    message: "You can not log out an API token",
  });

  const res = await server.inject({
    method: "DELETE",
    url: "/v1/auth/logout",
    headers: {
      // Using Disposable Auth Token so we can continue using the one from signup
      Authorization: DISPOSABLE_AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(204);
};
