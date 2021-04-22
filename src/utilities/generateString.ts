import { randomBytes } from "crypto";

/**
 *
 * @param length Length of the string
 * @returns Random string
 */

export const generateString = (length: number): Promise<string> =>
  new Promise((resolve, reject) => {
    randomBytes(length, (err, buffer) => {
      if (err) return reject(err);

      resolve(buffer.toString("hex"));
    });
  });
