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
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST /api/todos => cria uma nova todo
app.post("/api/todos", (req, res) => {
  todos.push(Todo(req.body.text, false));
  res.json({ status: "Success" });
});

// GET /api/todos/5 => exibe detalhes da Todo
// PUT /api/todos/5 => edita a todo
// DELETE /api/todos/5 => Apaga a Todo 5

app.listen(port);
