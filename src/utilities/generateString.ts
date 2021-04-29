import { randomBytes } from "crypto";

/**
 *
 * @param length Length of the string
 * @returns Random string
 */

export const generateString = (length: number): string => {
  // Dividing it by two because if we dont it'll be 16 characters for a length of 8, weirdo.
  return randomBytes(length / 2).toString("hex");
};
