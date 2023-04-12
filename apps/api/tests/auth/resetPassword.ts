import { server } from "../index.test";
import { AUTH_TOKEN } from "./register";

export default async () => {
  const resNoAuth = await server.inject({
    method: "POST",
    url: "/v1/auth/reset_password",
    payload: {
      old_password: "123456789",
      new_password: "12345678",
    },
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    message: "Unauthorized",
  });

  // Test to make have bad credentials
  const resWrongPassword = await server.inject({
    method: "POST",
    url: "/v1/auth/reset_password",
    payload: {
      old_password: "123456789",
      new_password: "12345678",
    },
    headers: {
      Authorization: AUTH_TOKEN,
    },
  });

  expect(resWrongPassword.statusCode).toBe(400);
  expect(resWrongPassword.json()).toHaveProperty("success", false);
  expect(resWrongPassword.json()).toHaveProperty("error", {
    message: "Invalid password",
  });

  const res = await server.inject({
    method: "POST",
    url: "/v1/auth/reset_password",
    payload: {
      old_password: "12345678",
      new_password: "123456789",
    },
    headers: {
      Authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(204);
};
