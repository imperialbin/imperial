import { createHash, createDecipheriv } from "crypto";

// Usage decrypt(hashedPassword, documentInfo.code, documentInfo.encryptedIv);

export const decrypt = (
  password: string,
  cipherText: string,
  initVector: string
): string => {
  const hashedPassword = createHash("sha256").update(password).digest();
  const decipher = createDecipheriv(
    "aes256",
    hashedPassword,
    Buffer.from(initVector, "hex")
  );
  return decipher.update(cipherText, "hex", "utf-8") + decipher.final("utf-8");
};
