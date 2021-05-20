import { sign } from "jsonwebtoken";
import { Consts } from "./consts";

const JWT_SECRET = Consts.JWT_SECRET;

/**
 * @param  {string} email
 * @returns string
 */
export const signToken = (email: string): string => {
  const payload = sign({ email }, JWT_SECRET, { expiresIn: "12h" });

  return payload;
};
