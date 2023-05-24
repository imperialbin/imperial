import { SelfUser } from "@imperial/commons";
import { server } from "../index.test";
import { customAlphabet } from "nanoid";

export let CREATED_USER: SelfUser;
export let BUDDY_USER: SelfUser;

export let AUTH_TOKEN = "";
export let BUDDY_AUTH_TOKEN = "";

const alphanumericUsername = customAlphabet("abcdefghijklmnopqrstuvwxyz", 5);

export default async () => {
  const created_username = `unit-test-${alphanumericUsername(5)}`;
  const buddy_username = `unit-test-buddy-${alphanumericUsername(5)}`;

  const res = await server.inject({
    method: "POST",
    url: "/v1/auth/signup",
    payload: {
      username: created_username,
      email: `${created_username}@impb.in`,
      password: "12345678",
    },
  });

  expect(res.json()).toHaveProperty("success", true);
  expect(res.json().data).toHaveProperty("token");
  expect(res.json().data).toHaveProperty("user");
  expect(res.json().data.user).toHaveProperty("username", created_username);
  expect(res.json().data.user).toHaveProperty(
    "email",
    `${created_username}@impb.in`,
  );

  // Test to make sure the username and email are unique
  const resUsernameExists = await server.inject({
    method: "POST",
    url: "/v1/auth/signup",
    payload: {
      username: created_username,
      email: `${created_username}@impb.in`,
      password: "12345678",
    },
  });

  expect(resUsernameExists.json()).toHaveProperty("success", false);
  expect(resUsernameExists.json()).toHaveProperty("error", {
    code: "bad_request",
    message: "Username already exists",
  });

  const resEmailExists = await server.inject({
    method: "POST",
    url: "/v1/auth/signup",
    payload: {
      username: created_username + "2",
      email: `${created_username}@impb.in`,
      password: "12345678",
    },
  });

  expect(resEmailExists.json()).toHaveProperty("success", false);
  expect(resEmailExists.json()).toHaveProperty("error", {
    code: "bad_request",
    message: "Email already exists",
  });

  // This account will be used to test requests that require more than one user
  const resBuddy = await server.inject({
    method: "POST",
    url: "/v1/auth/signup",
    payload: {
      username: buddy_username,
      email: `${buddy_username}@impb.in`,
      password: "12345678",
    },
  });

  BUDDY_USER = resBuddy.json().data.user as SelfUser;
  BUDDY_AUTH_TOKEN = resBuddy.json().data.token as string;

  CREATED_USER = res.json().data.user as SelfUser;
  AUTH_TOKEN = res.json().data.token as string;
};
