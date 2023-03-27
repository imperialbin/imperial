import { randomBytes } from "crypto";

const generateRandomSecureString = (length: number): string => {
  return randomBytes(length).toString("hex");
};

export { generateRandomSecureString };
