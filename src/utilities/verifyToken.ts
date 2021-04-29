import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "uwu";

/**
 * @param  {string} token
 * @returns string
 */
export const verifyToken = (token: string): string => {
  const payload = verify(token, JWT_SECRET) as {
    email: string;
  };

  return payload.email;
};
