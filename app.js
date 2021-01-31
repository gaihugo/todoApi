const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser"); //Pega o body num formato json legivel para js
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv/config");
const { todoRouter, Todo } = require("./todo");

app.use(morgan("dev"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose

mongoose
  .connect(process.env.CONECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("OK!!"))
  .catch((e) => console.error("ERROR", e));

const User = mongoose.model("User", {
  username: String,
  passwordHash: String,
  passwordSalt: String,
  email: String,
});

// Rotas
app.use("/api/todos", todoRouter);

app.listen(port);
