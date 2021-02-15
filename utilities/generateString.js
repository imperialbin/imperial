module.exports = (length) => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";

  for (let i = 0; i < length; i++) str += characters.charAt(Math.floor(Math.random() * characters.length));
  return str;
};
