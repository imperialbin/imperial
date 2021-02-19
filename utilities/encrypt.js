const crypto = require("crypto");

module.exports = (password, code, initVector) => {
  const cipher = crypto.createCipheriv("aes256", password, initVector);
  return cipher.update(code, "utf-8", "hex") + cipher.final("hex");
};
