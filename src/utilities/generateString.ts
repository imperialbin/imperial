import cryptoRandomString from "crypto-random-string";

/**
 *
 * @param length Length of the string
 * @returns Random string
 */

export const generateString = (length: number): string => {
  return cryptoRandomString({ length, type: "url-safe" });
};
