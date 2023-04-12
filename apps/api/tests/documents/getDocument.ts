import { server } from "../index.test";
import { CREATED_DOCUMENTS } from "./createDocument";

export default async () => {
  const resNotFound = await server.inject({
    method: "GET",
    url: "/v1/document/12345678",
  });

  expect(resNotFound.statusCode).toBe(404);

  const res = await server.inject({
    method: "GET",
    url: `/v1/document/${CREATED_DOCUMENTS[0].id}`,
  });

  expect(res.statusCode).toBe(200);
  expect(res.json()).toHaveProperty("success", true);
  expect(res.json()).toHaveProperty("data");
  expect(res.json().data).toHaveProperty("id", CREATED_DOCUMENTS[0].id);
  expect(res.json().data).toHaveProperty(
    "content",
    CREATED_DOCUMENTS[0].content,
  );
  expect(res.json().data).toHaveProperty(
    "settings",
    CREATED_DOCUMENTS[0].settings,
  );

  const resEncryptedWrongPassword = await server.inject({
    method: "GET",
    url: `/v1/document/${CREATED_DOCUMENTS[1].id}?password=wrongpassword`,
  });

  expect(resEncryptedWrongPassword.statusCode).toBe(400);
  expect(resEncryptedWrongPassword.json()).toHaveProperty("success", false);
  expect(resEncryptedWrongPassword.json()).toHaveProperty("error", {
    message: "Invalid password",
  });

  const resEncryptedNoPassword = await server.inject({
    method: "GET",
    url: `/v1/document/${CREATED_DOCUMENTS[1].id}`,
  });

  expect(resEncryptedNoPassword.statusCode).toBe(200);
  expect(resEncryptedNoPassword.json()).toHaveProperty("success", true);
  expect(resEncryptedNoPassword.json()).toHaveProperty("data");
  expect(resEncryptedNoPassword.json().data).toHaveProperty(
    "id",
    CREATED_DOCUMENTS[1].id,
  );
  expect(resEncryptedNoPassword.json().data.content).toContain(
    "IMPERIAL_ENCRYPTED",
  );

  const resEncryptedWithCorrectPassword = await server.inject({
    method: "GET",
    url: `/v1/document/${CREATED_DOCUMENTS[1].id}?password=${
      CREATED_DOCUMENTS[1].password ?? ""
    }`,
  });

  expect(resEncryptedWithCorrectPassword.statusCode).toBe(200);
  expect(resEncryptedWithCorrectPassword.json()).toHaveProperty(
    "success",
    true,
  );
  expect(resEncryptedWithCorrectPassword.json()).toHaveProperty("data");
  expect(resEncryptedWithCorrectPassword.json().data).toHaveProperty(
    "id",
    CREATED_DOCUMENTS[1].id,
  );
  expect(resEncryptedWithCorrectPassword.json().data).toHaveProperty(
    "content",
    CREATED_DOCUMENTS[1].content,
  );
};
