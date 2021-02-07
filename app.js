const morgan = require("morgan");
const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser"); //Pega o body num formato json legivel para js
const passport = require("passport")
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv/config");

const todoRouter = require("./routes/todo");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

app.use(morgan("dev"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: process.env.SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// Mongoose

mongoose
  .connect(process.env.CONECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("OK!!"))
  .catch((e) => console.error("ERROR", e));

// Rotas
app.use("/api/todos", todoRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter)

// Inicia o servidor
app.listen(port);
