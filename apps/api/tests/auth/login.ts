import { server } from "../index.test";
import { CREATED_USER } from "./register";

export let DISPOSABLE_AUTH_TOKEN = "";

export default async () => {
  // Test to make have bad credentials
  const resBadUsername = await server.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      username: CREATED_USER.username + "bad",
      password: "12345678",
    },
  });

  expect(resBadUsername.json()).toHaveProperty("success", false);
  expect(resBadUsername.json()).toHaveProperty("error", {
    message: "Incorrect username or password",
  });

  const resBadPassword = await server.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      username: CREATED_USER.username,
      password: "123456789",
    },
  });

  expect(resBadPassword.json()).toHaveProperty("success", false);
  expect(resBadPassword.json()).toHaveProperty("error", {
    message: "Incorrect username or password",
  });

  const res = await server.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      username: CREATED_USER.username,
      password: "12345678",
    },
  });

  expect(res.json()).toHaveProperty("success", true);
  expect(res.json().data).toHaveProperty("token");

  DISPOSABLE_AUTH_TOKEN = res.json().data.token as string;
};
