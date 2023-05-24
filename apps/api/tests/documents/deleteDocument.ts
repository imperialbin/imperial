import { AUTH_TOKEN } from "../auth/register";
import { server } from "../index.test";
import { CREATED_DOCUMENTS } from "./createDocument";

export default async () => {
  const resNoAuth = await server.inject({
    method: "DELETE",
    url: "/v1/document/12345678",
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const resNoDocument = await server.inject({
    method: "DELETE",
    url: "/v1/document/12345678",
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resNoDocument.statusCode).toBe(404);
  expect(resNoDocument.json()).toHaveProperty("success", false);
  expect(resNoDocument.json()).toHaveProperty("error", {
    code: "not_found",
    message: "Document not found",
  });

  const res = await server.inject({
    method: "DELETE",
    url: `/v1/document/${CREATED_DOCUMENTS[0].id}`,
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(204);

  const resEncrypted = await server.inject({
    method: "DELETE",
    url: `/v1/document/${CREATED_DOCUMENTS[1].id}`,
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resEncrypted.statusCode).toBe(204);
};
