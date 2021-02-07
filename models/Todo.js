const mongoose = require("mongoose");
const Todo = mongoose.model("Todo", {
    name: String,
    completed: Boolean,
  });

module.exports = Todo

