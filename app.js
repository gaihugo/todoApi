const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser"); //Pega o body num formato json legivel para js
const app = express();
const port = 3000;

app.use(morgan("dev"));

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var indice_atual = 0;

function Todo(name, completed) {
  var id = indice_atual;
  indice_atual++;
  return { id, name, completed };
}

var todos = [Todo("Comprar Peixe", false), Todo("Comprar Carne", true)];

// GET /api/todos => lista de todas as Todos
app.get("/api/todos/", (req, res) => {
  res.json(todos);
});

// POST /api/todos => cria uma nova todo
app.post("/api/todos/", (req, res) => {
  todos.push(Todo(req.body.text, false));
  res.json({ status: "Success" });
});

// GET /api/todos/5 => exibe detalhes da Todo
app.get("/api/todos/:id/", (req, res) => {
  // req.params.id
  res.json(todos.find((todo) => todo.id == req.params.id));
});

// PUT /api/todos/5 => edita a todo
app.put("/api/todos/:id/", (req, res) => {
  // req.params.id
  var todo = todos.find((todo) => todo.id == req.params.id);
  todo.name = req.body.text || todo.name;
  todo.completed = req.body.completed;

  res.json({ status: "Success" });
});

// DELETE /api/todos/5 => Apaga a Todo 5

app.listen(port);
