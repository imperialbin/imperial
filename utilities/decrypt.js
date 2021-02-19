const crypto = require("crypto");

module.exports = (password, cipherText, initVector) => {
  const decipher = crypto.createDecipheriv("aes256", Buffer.from(password, "hex"), Buffer.from(initVector, "hex"));
  return decipher.update(cipherText, "hex", "utf-8") + decipher.final("utf-8");
};
