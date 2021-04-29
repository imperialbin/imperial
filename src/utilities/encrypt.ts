import { createCipheriv } from "crypto";

/**
 * @param  {string} password
 * @param  {string} code
 * @param  {string} initVector
 * @returns string
 */
export const encrypt = (
  password: string,
  code: string,
  initVector: string
): string => {
  const cipher = createCipheriv("aes256", password, initVector);
  return cipher.update(code, "utf-8", "hex") + cipher.final("hex");
};
