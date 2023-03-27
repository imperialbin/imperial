import {
  createHash,
  createDecipheriv,
  createCipheriv,
  randomBytes,
} from "crypto";

const decrypt = (
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

const encrypt = (password: string, content: string): string => {
  const cipher = createCipheriv(
    "aes256",
    // we're creating a hash here just in case password is under 32 characters long (it must be 32 characters long)
    createHash("sha256").update(password).digest(),
    randomBytes(16).toString("hex")
  );
  return cipher.update(content, "utf-8", "hex") + cipher.final("hex");
};

export { decrypt, encrypt };
