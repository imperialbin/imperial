import { randomBytes } from "crypto";

const generateRandomSecureString = (length: number): string =>
  randomBytes(length).toString("hex");

export { generateRandomSecureString };
