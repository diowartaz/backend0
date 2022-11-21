const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  newUserValidation,
  connexionValidation,
} = require("../validation/user");

const jwt = require("jsonwebtoken");

exports.listUser = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createUser = (req, res, next) => {
  //body validation
  const { error } = newUserValidation(req.body);
  if (error) {
    return res.status(401).json(error.details[0].message);
  }

  //password hash
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      if (!hash) {
        return res.status(500).json({ message: "Password hash error" });
      }
      const user = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
      })
        .save()
        .then((result) => {
          res.status(201).json({ message: "User created" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(500).json(error));
};

exports.connexion = (req, res, next) => {
  //body validation
  const { error } = connexionValidation(req.body);
  if (error) {
    return res.status(401).json({ message: error.details[0].message });
  }
  //on recupere le user avec l'email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      bcrypt
        .compare(req.body.password, user.password)
        .then((match) => {
          if (!match) return res.status(500).json(error);
          res.status(200).json({
            email: user.email,
            id: user._id,
            token: jwt.sign({ id: user._id }, process.env.SECRET_KEY_JWT, {
              expiresIn: "12h",
            }),
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
