import crypto from "crypto";

// Usage encrypt(hashedPassword, text, initVector);

export default (password: string, code: string, initVector: string): string => {
  const cipher = crypto.createCipheriv("aes256", password, initVector);
  return cipher.update(code, "utf-8", "hex") + cipher.final("hex");
};
