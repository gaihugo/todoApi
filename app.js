const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser"); //Pega o body num formato json legivel para js
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv/config");

app.use(morgan("dev"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.CONECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("OK!!"))
  .catch((e) => console.error("ERROR", e));

const Todo = mongoose.model("Todo", {
  name: String,
  completed: Boolean,
});

// GET /api/todos => lista de todas as Todos
app.get("/api/todos/", (req, res) => {
  Todo.find({}).then((todos) => res.json(todos));
});

// POST /api/todos => cria uma nova todo
app.post("/api/todos/", (req, res) => {
  const todo = new Todo({
    name: req.body.text,
    completed: false,
  });
  todo.save().then(() => {
    res.json({ status: "Success" });
  });
});

// GET /api/todos/5 => exibe detalhes da Todo
app.get("/api/todos/:id/", (req, res) => {
  // req.params.id
  Todo.findById(req.params.id).then((todo) => {
    res.json(todo);
  });
});

// PUT /api/todos/5 => edita a todo
app.put("/api/todos/:id/", (req, res) => {
  // req.params.id
  Todo.findById(req.params.id).then((todo) => {
    todo.name = req.body.text || todo.name;
    todo.completed = req.body.completed;
    todo
      .save()
      .then(() => {
        res.json({ status: "Success" });
      })
      .catch((e) => console.error(e));
  });
});

// DELETE /api/todos/5 => Apaga a Todo 5
app.delete("/api/todos/:id/", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id });

  res.json({ status: "Success" });
});

app.listen(port);
