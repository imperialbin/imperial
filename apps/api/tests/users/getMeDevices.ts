import { AUTH_TOKEN } from "../auth/register";
import { server } from "../index.test";

export let ACTIVE_DEVICES: Array<{
  id: string;
  user: string;
  user_agent: string;
  ip: string;
  created_at: string;
}> = [];

export default async () => {
  const resNoAuth = await server.inject({
    method: "GET",
    url: "/v1/users/@me/devices",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const res = await server.inject({
    method: "GET",
    url: "/v1/users/@me/devices",
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");

  ACTIVE_DEVICES = res.json().data as typeof ACTIVE_DEVICES;
};
