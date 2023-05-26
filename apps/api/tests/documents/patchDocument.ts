import { AUTH_TOKEN } from "../auth/register";
import { server } from "../index.test";
import { CREATED_DOCUMENTS } from "./createDocument";

export default async () => {
  const resNoAuth = await server.inject({
    method: "PATCH",
    url: "/v1/document",
    payload: {
      id: "12345678",
      content: "hello world!",
    },
  });

  expect(resNoAuth.statusCode).toBe(401);
  expect(resNoAuth.json()).toHaveProperty("success", false);
  expect(resNoAuth.json()).toHaveProperty("error", {
    code: "unauthorized",
    message: "You must be authenticated to access this route",
  });

  const resNoDocument = await server.inject({
    method: "PATCH",
    url: "/v1/document",
    payload: {
      id: "12345678",
      content: "hello world!",
    },
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

  const resEncryptedDocument = await server.inject({
    method: "PATCH",
    url: `/v1/document`,
    payload: {
      id: CREATED_DOCUMENTS[1].id,
      content: "hello world!",
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(resEncryptedDocument.statusCode).toBe(400);
  expect(resEncryptedDocument.json()).toHaveProperty("success", false);
  expect(resEncryptedDocument.json()).toHaveProperty("error", {
    code: "bad_request",
    message: "You can not edit an encrypted document",
  });

  const res = await server.inject({
    method: "PATCH",
    url: `/v1/document`,
    payload: {
      id: CREATED_DOCUMENTS[0].id,
      content: "hello world!",
      settings: {
        language: "plaintext",
        public: false,
        image_embed: false,
        editors: [],
      },
    },
    headers: {
      authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data).toHaveProperty("id", CREATED_DOCUMENTS[0].id);
  expect(res.json().data).toHaveProperty("content", "hello world!");
  expect(res.json().data).toHaveProperty("settings", {
    ...CREATED_DOCUMENTS[0].settings,
    language: "plaintext",
    public: false,
    image_embed: false,
    editors: [],
  });
};
