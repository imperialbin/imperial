/* Modules for encrypting and decrypting documents */
import CryptoJS from "crypto-js";

/**
 * Utility function that encrypts data on the client
 */
export const encrypt = (password: string, content: string) => {
  return CryptoJS.AES.encrypt(content, password);
};

/**
 * Utility function that decrypts encrypted content with a password, returns
 * null if password does not match
 */
export const decrypt = (password: string, encryptedIV: string) => {
  const decryptedValue = CryptoJS.AES.decrypt(encryptedIV, password).toString(
    CryptoJS.enc.Utf8
  );
  return decryptedValue.length !== 0 ? decryptedValue : null;
};
