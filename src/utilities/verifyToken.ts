import { verify } from "jsonwebtoken";
import { Consts } from "./consts";

const JWT_SECRET = Consts.JWT_SECRET;

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
