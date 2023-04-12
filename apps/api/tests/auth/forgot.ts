import { server } from "../index.test";

export default async () => {
  // Test to make have bad credentials
  const resWrongPassword = await server.inject({
    method: "POST",
    url: "/v1/auth/forgot",
    payload: {
      email: "test-wrong@impb.in",
    },
  });

  // This will act like it succeeded to prevent email enumeration
  expect(resWrongPassword.statusCode).toBe(204);

  const res = await server.inject({
    method: "POST",
    url: "/v1/auth/forgot",
    payload: {
      email: "test@impb.in",
    },
  });

  expect(res.statusCode).toBe(204);
};
