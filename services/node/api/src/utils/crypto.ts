import {
  createHash,
  createDecipheriv,
  createCipheriv,
  randomBytes,
} from "crypto";

const decrypt = (password: string, cipherText: string): string => {
  const [initVector, text] = cipherText
    .split("IMPERIAL_ENCRYPTED")[1]
    .split(":");
  const hashedPassword = createHash("sha256").update(password).digest();
  const decipher = createDecipheriv(
    "aes256",
    hashedPassword,
    Buffer.from(initVector, "hex")
  );

  return decipher.update(text, "hex", "utf-8") + decipher.final("utf-8");
};

const encrypt = (password: string, content: string): string => {
  const initVector = randomBytes(16);

  const hashedPassword = createHash("sha256").update(password).digest();
  const cipher = createCipheriv("aes256", hashedPassword, initVector);
  return `${initVector.toString("hex")}:${
    cipher.update(content, "utf-8", "hex") + cipher.final("hex")
  }`;
};

export { decrypt, encrypt };
