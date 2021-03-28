import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "uwu";

export const signToken = (email: string): string => {
  const payload = sign({ email }, JWT_SECRET, { expiresIn: "12h" });

  return payload;
};
