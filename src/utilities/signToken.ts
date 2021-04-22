import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "uwu";

/**
 * @param  {string} email
 * @returns string
 */
export const signToken = (email: string): string => {
  const payload = sign({ email }, JWT_SECRET, { expiresIn: "12h" });

  return payload;
};
