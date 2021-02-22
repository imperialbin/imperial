const crypto = require("crypto");

// Usage encrypt(hashedPassword, text, initVector);

module.exports = (password, code, initVector) => {
  const cipher = crypto.createCipheriv("aes256", password, initVector);
  return cipher.update(code, "utf-8", "hex") + cipher.final("hex");
};
