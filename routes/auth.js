const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const User = require("../models/User")

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const iterations = 100000;

// Autenticar

function validPassword(user, password) {
    var salt = user.passwordSalt
    var hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512');
  
    return hash == user.passwordHash;
}


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err); }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!validPassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Serializar usuario

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
  

// Login (POST /api/auth/login) (username password)
router.post('/login',
  passport.authenticate('local'),
  function (req, res) {
      console.log("Ola, ", req.user.username)
      res.json({status: "Success", user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        admin: req.user.admin
      }})
  }
);

// Logout (GET /api/auth/logout)
router.get('/logout', (req, res) => {
  req.logout()
  res.json({status: "Success"})
})


// Get Logged User (GET /api/auth/me)
router.get('/me', (req, res) => {
  if (!req.user) {
    res.json({logged: false})
    return
  }
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    admin: req.user.admin,
    logged: true
  })
})

module.exports = router