const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  betaCode: String,
  banned: Boolean,
  confirmed: Boolean,
  ip: String,
  codesLeft: Number,
  icon: String,
  password: String,
  memberPlus: Boolean,
  codes: Array,
  apiToken: String,
});

module.exports = mongoose.model("Users", UserSchema);
