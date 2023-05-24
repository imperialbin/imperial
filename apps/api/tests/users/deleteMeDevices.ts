import { AUTH_TOKEN } from "../auth/register";
import { server } from "../index.test";
import { ACTIVE_DEVICES } from "./getMeDevices";

export default async () => {
  const resNoAuth = await server.inject({
    method: "POST",
    url: "/v1/users/@me/devices",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const resNoDeviceFound = await server.inject({
    method: "POST",
    url: "/v1/users/@me/devices",
    payload: {
      device_id: "device_no",
      password: "123456789",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resNoDeviceFound.statusCode).toBe(404);
  expect(resNoDeviceFound.json()).toHaveProperty("success", false);
  expect(resNoDeviceFound.json()).toHaveProperty("error", {
    code: "not_found",
    message: "Device not found",
  });

  const resBadPassword = await server.inject({
    method: "POST",
    url: "/v1/users/@me/devices",
    payload: {
      device_id: ACTIVE_DEVICES[0].id,
      password: "12345678",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resBadPassword.statusCode).toBe(401);
  expect(resBadPassword.json()).toHaveProperty("success", false);
  expect(resBadPassword.json()).toHaveProperty("error", {
    code: "bad_request",
    message: "Incorrect password",
  });

  const res = await server.inject({
    method: "POST",
    url: "/v1/users/@me/devices",
    payload: {
      device_id: ACTIVE_DEVICES[0].id,
      password: "123456789",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(204);
};
