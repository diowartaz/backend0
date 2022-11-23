const User = require("../models/user");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const { City } = require("../utils");

function getUserIdFromJWT(req) {
  let res = {
    error: null,
    id: null,
  };
  try {
    let token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    res.id = decoded.id;
    return res;
  } catch (error) {
    res.error = error;
    return res;
  }
}

exports.startGame = (req, res, next) => {
  const { error, id } = getUserIdFromJWT(req);
  if (error) {
    return res.status(400).json({
      error: error,
    });
  }

  User.findOne({ _id: id })
    .then((user) => {})
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.userXP = (req, res, next) => {
  console.log("userXP");
  const { error, id } = getUserIdFromJWT(req);
  if (error) {
    return res.status(400).json({
      error: error,
    });
  }
  User.findOne({ _id: id })
    .then((user) => {
      user.xp = user.xp + 1;
      User.updateOne({ _id: id }, user)
        .then((updateOneResult) => {
          user["password"] = undefined;
          res.status(200).json({ user: user });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.searchForItems = (req, res, next) => {
  const { error, id } = getUserIdFromJWT(req);
  if (error) {
    return res.status(400).json({
      error: error,
    });
  }
  User.findOne({ _id: id })
    .then((user) => {
      const randomItem = findRandomItem();
      //verify that we have time to find items

      //add items to city inventory

      User.updateOne({ _id: id }, user)
        .then((updateOneResult) => {
          res.status(200).json({ user: user });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
