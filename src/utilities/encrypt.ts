import { createCipheriv } from "crypto";

// Usage encrypt(hashedPassword, text, initVector);
export const encrypt = (
  password: string,
  code: string,
  initVector: string
): string => {
  const cipher = createCipheriv("aes256", password, initVector);
  return cipher.update(code, "utf-8", "hex") + cipher.final("hex");
};
