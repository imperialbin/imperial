import crypto from "crypto";

// Usage decrypt(hashedPassword, documentInfo.code, documentInfo.encryptedIv);

export default (
  password: string,
  cipherText: string,
  initVector: string
): string => {
  const hashedPassword = crypto.createHash("sha256").update(password).digest();
  const decipher = crypto.createDecipheriv(
    "aes256",
    hashedPassword,
    Buffer.from(initVector, "hex")
  );
  return decipher.update(cipherText, "hex", "utf-8") + decipher.final("utf-8");
};
