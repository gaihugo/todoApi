const mongoose = require("mongoose");
const User = mongoose.model("User", {
    username: String,
    passwordHash: String,
    passwordSalt: String,
    email: String,
    admin: Boolean,
  });

  module.exports = User