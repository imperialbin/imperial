import { main } from "../src/server";
import createMemberPlusToken from "./admin/createMemberPlusToken";
import getRecentDocuments from "./admin/getRecentDocuments";
import getUserAdmin from "./admin/getUser";
import patchUser from "./admin/patchUser";
import forgot from "./auth/forgot";
import login from "./auth/login";
import logout from "./auth/logout";
import register from "./auth/register";
import resendConfirmEmail from "./auth/resendConfirmEmail";
import resetPassword from "./auth/resetPassword";
import createDocument from "./documents/createDocument";
import deleteDocument from "./documents/deleteDocument";
import getDocument from "./documents/getDocument";
import patchDocument from "./documents/patchDocument";
import introduction from "./introductions/introduction";
import v1Introduction from "./introductions/v1Introduction";
import deleteMe from "./users/deleteMe";
import getMe from "./users/getMe";
import getMeDevices from "./users/getMeDevices";
import getMeRecentDocuments from "./users/getMeRecentDocuments";
import getUser from "./users/getUser";
import patchMe from "./users/patchMe";
import regenerateAPIToken from "./users/regenerateAPIToken";
import searchUser from "./users/searchUser";
import upgradeMe from "./users/upgradeMe";

/**
 * Omitted Tests
 *
 * Auth:
 * Confirm Email - Requires email to be sent
 * Rest password with token - Requires email to be sent
 *
 * OAuth:
 * All Discord callbacks - Requires frontend
 * All GitHub callbacks - Requires frontend
 *
 * Users:
 * delete me devices - it was annoying, ill do this later
 *
 */

export const ADMIN_AUTH_TOKEN = process.env.ADMIN_AUTH_TOKEN ?? "";

export let server: Awaited<ReturnType<typeof main>>;

beforeAll(async () => {
  server = await main();
});

afterAll(async () => {
  await server.close();
});

describe("Test IMPERIAL API", () => {
  test("GET introduction", introduction);
  test("GET v1 introduction", v1Introduction);

  // Auth
  test("Can register", register);
  test("Can login", login);
  test("Can logout", logout);
  test("Can resend confirm email", resendConfirmEmail);
  test("Can reset password", resetPassword);
  test("Can request password reset", forgot);

  // Document
  test("Can create document", createDocument);
  test("Can get document", getDocument);
  test("Can patch document", patchDocument);
  test("Can delete document", deleteDocument);

  // Admin
  if (ADMIN_AUTH_TOKEN) {
    test("Can create member+ tokens", createMemberPlusToken);
    test("Can get recent documents", getRecentDocuments);
    test("Can patch user", patchUser);
    test("Can get user", getUserAdmin);
  } else {
    console.warn("ADMIN_AUTH_TOKEN not set, skipping admin tests");
  }

  // Users
  test("Can get @me", getMe);
  test("Can get @me devices", getMeDevices);
  test("Can get @me recent documents", getMeRecentDocuments);
  test("Can get user", getUser);
  test("Can patch @me", patchMe);
  test("Can regenerate API Token", regenerateAPIToken);
  test("Can search user", searchUser);

  // If there is no admin token there is definitely no member+ token
  if (ADMIN_AUTH_TOKEN) {
    test("Can upgrade", upgradeMe);
  }

  test("Can delete me", deleteMe);
});
