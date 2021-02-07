const express = require("express");
const router = express.Router();
const crypto = require("crypto");
require("dotenv/config");

const User = require("../models/User")
const iterations = 100000;

function hashPassword(password) {
  var salt = crypto.randomBytes(128).toString("base64");
  var hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512');

  return {
    salt: salt,
    hash: hash,
  };
}

// GET /api/users => lista de todos os Users
router.get("/", (req, res) => {
  User.find({}).then((users) =>
    res.json(
      users.map((u) => ({
        username: u.username,
        email: u.email,
        admin: u.admin,
      }))
    )
  );
});

// POST /api/users => cria um novo user
router.post("/", (req, res) => {
  // Body Params: username, password, email

  if (req.body.password == "") {
    res.status(400).send("Password required")
    return;
  }

  if (req.body.password.length < 6 ) { // Regular Expressions
    res.status(400).send("Password is too short")
    return;
  }

  if (req.body.username == "") {
    res.status(400).send("Username required")
    return;
  }

  // TODO Verificar se já não existe um usuario com mesmo username ou email

  // Generate Hash and Salt
  var { salt, hash } = hashPassword(req.body.password);
  // Save
  const user = new User({
    username: req.body.username,
    passwordHash: hash,
    passwordSalt: salt,
    email: req.body.email,
    admin: false,
  })
  user.save().then(() => {
    res.json({ status: "Success"})
  }).catch((err) => {
    res.status(500).send(err)
    console.error(err)
  })
});

// // GET /api/todos/5 => exibe detalhes da Todo
// router.get("/:id/", (req, res) => {
//   // req.params.id
//   Todo.findById(req.params.id).then((todo) => {
//     res.json(todo);
//   });
// });

// // PUT /api/todos/5 => edita a todo
// router.put("/:id/", (req, res) => {
//   // req.params.id
//   Todo.findById(req.params.id).then((todo) => {
//     todo.name = req.body.text || todo.name;
//     todo.completed = req.body.completed;
//     todo
//       .save()
//       .then(() => {
//         res.json({ status: "Success" });
//       })
//       .catch((e) => console.error(e));
//   });
// });

// // DELETE /api/todos/5 => Apaga a Todo 5
// router.delete("/:id/", async (req, res) => {
//   await Todo.deleteOne({ _id: req.params.id });

//   res.json({ status: "Success" });
// });

module.exports = router;
