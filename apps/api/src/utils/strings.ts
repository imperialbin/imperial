import { randomBytes } from "crypto";
import { customAlphabet } from "nanoid";

const generateRandomSecureString = (length: number): string =>
  randomBytes(length).toString("hex");

// Alphabet minus l and i because thats annoying trying to figure out the difference between them
const documentIdGenerator = customAlphabet("abcdefghjknompqrstuvwxyz0", 8);

export { generateRandomSecureString, documentIdGenerator };
