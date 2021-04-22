import { randomBytes } from "crypto";

/**
 *
 * @param length Length of the string
 * @returns Random string
 */

export const generateString = (length: number): string => {
  return randomBytes(length).toString("hex");
};
