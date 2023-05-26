import * as CryptoJS from "crypto-js";

const decrypt = (password: string, encryptedIV: string) => {
  try {
    const decryptedValue = CryptoJS.AES.decrypt(
      encryptedIV.split("IMPERIAL_ENCRYPTED")[1],
      password,
    ).toString(CryptoJS.enc.Utf8);

    return decryptedValue.length !== 0 ? decryptedValue : null;
  } catch {
    return null;
  }
};

const encrypt = (password: string, content: string) =>
  "IMPERIAL_ENCRYPTED" + CryptoJS.AES.encrypt(content, password).toString();

export { decrypt, encrypt };
