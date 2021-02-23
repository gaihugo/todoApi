const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo")




// GET /api/todos => lista de todas as Todos
router.get("/", (req, res) => {
  Todo.find({}).then((todos) => res.json(todos));
});

// POST /api/todos => cria uma nova todo
router.post("/", (req, res) => {
  if (!req.body.text){
    res.json({ status: "Text is required" });
    return
  }
  const todo = new Todo({
    name: req.body.text,
    completed: false,
  });
  todo.save().then(() => {
    res.json({ status: "Success" });
  });
})

// GET /api/todos/5 => exibe detalhes da Todo
router.get("/:id/", (req, res) => {
  // req.params.id
  Todo.findById(req.params.id).then((todo) => {
    res.json(todo);
  });
});

// GET /api/todos/<id>/complete => completa a todo
router.get("/:id/complete/", async (req,res) => {
  var todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed
  todo.save().then(()=> {
    res.json(todo)
  })
  .catch((e) => console.error(e));

})

// PUT /api/todos/5 => edita a todo
router.put("/:id/", (req, res) => {
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
router.delete("/:id/", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id });

  res.json({ status: "Success" });
});

module.exports = router


