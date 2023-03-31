/* Modules for encrypting and decrypting documents */
import CryptoJS from "crypto-js";
import cryptoRandomString from "crypto-random-string";

export const generateSecureString = (length: number) => {
  return cryptoRandomString({ length, type: "url-safe" });
};

/**
 * Utility function that encrypts data on the client
 */
export const encrypt = (password: string, content: string) => {
  return (
    "IMPERIAL_ENCRYPTED" + CryptoJS.AES.encrypt(content, password).toString()
  );
};

/**
 * Utility function that decrypts encrypted content with a password, returns
 * null if password does not match
 */
export const decrypt = (password: string, encryptedIV: string) => {
  try {
    const decryptedValue = CryptoJS.AES.decrypt(
      encryptedIV.split("IMPERIAL_ENCRYPTED")[1],
      password
    ).toString(CryptoJS.enc.Utf8);

    return decryptedValue.length !== 0 ? decryptedValue : null;
  } catch (err) {
    return null;
  }
};
