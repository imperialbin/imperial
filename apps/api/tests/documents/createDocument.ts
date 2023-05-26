import { Document } from "@imperial/commons";
import { AUTH_TOKEN, BUDDY_USER, CREATED_USER } from "../auth/register";
import { server } from "../index.test";

export const CREATED_DOCUMENTS: Array<Document & { password?: string }> = [];

export default async () => {
  const resNoContent = await server.inject({
    method: "POST",
    url: "/v1/document",
    payload: {
      content: "",
    },
  });
  expect(resNoContent.statusCode).toBe(400);

  const resNoAuth = await server.inject({
    method: "POST",
    url: "/v1/document",
    payload: {
      content: "hello world!",
      // All of these except language should get set back to default since request has no auth
      settings: {
        language: "typescript",
        image_embed: true,
        instant_delete: true,
        encrypted: true,
        long_urls: true,
        public: true,
        editors: [BUDDY_USER.username],
      },
    },
  });

  expect(resNoAuth.statusCode).toBe(200);
  expect(resNoAuth.json()).toHaveProperty("success");
  expect(resNoAuth.json()).toHaveProperty("data");
  expect(resNoAuth.json().data.id).toHaveLength(8);
  expect(resNoAuth.json().data).toHaveProperty("content", "hello world!");
  expect(resNoAuth.json().data).toHaveProperty("settings", {
    language: "typescript",
    image_embed: false,
    instant_delete: false,
    encrypted: false,
    public: false,
    editors: [],
  });

  const res = await server.inject({
    method: "POST",
    url: "/v1/document",
    payload: {
      content: "hello world!",
      settings: {
        language: "typescript",
        image_embed: true,
        instant_delete: true,
        encrypted: false,
        long_urls: true,
        public: true,
        editors: [BUDDY_USER.username],
      },
    },
    headers: {
      Authorization: AUTH_TOKEN,
    },
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success");
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data.id).toHaveLength(36);
  expect(res.json().data).toHaveProperty("content", "hello world!");
  expect(res.json().data).toHaveProperty("creator", {
    id: CREATED_USER.id,
    username: CREATED_USER.username,
    documents_made: 1,
    flags: CREATED_USER.flags,
    icon: CREATED_USER.icon,
  });
  expect(res.json().data).toHaveProperty("settings", {
    language: "typescript",
    image_embed: true,
    instant_delete: true,
    encrypted: false,
    public: true,
    editors: [
      {
        id: BUDDY_USER.id,
        username: BUDDY_USER.username,
        documents_made: 0,
        flags: BUDDY_USER.flags,
        icon: BUDDY_USER.icon,
      },
    ],
  });

  const resEncrypted = await server.inject({
    method: "POST",
    url: "/v1/document",
    payload: {
      content: "hello world!",
      settings: {
        encrypted: true,
      },
    },
    headers: {
      Authorization: AUTH_TOKEN,
    },
  });

  CREATED_DOCUMENTS.push(res.json().data as Document);
  CREATED_DOCUMENTS.push(resEncrypted.json().data as Document);
};
