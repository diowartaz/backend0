const User = require("../models/user");
const { getUserIdFromJWT } = require("../utils/utils");

exports.xp = (req, res, next) => {
  let getUserIdFromJWTRes = getUserIdFromJWT(req);
  if (getUserIdFromJWTRes.error) {
    return res.status(400).json({
      error: getUserIdFromJWTRes.error,
    });
  }

  User.findOne({ _id: getUserIdFromJWTRes.id })
    .then((user) => {
      if (user.game) {
        res.status(200).json({
          xp: user.game.xp,
        });
      } else {
        res.status(400).json({
          error: "No game has ever started: game not initialized",
          user: user,
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.city = (req, res, next) => {
  let getUserIdFromJWTRes = getUserIdFromJWT(req);
  if (getUserIdFromJWTRes.error) {
    return res.status(400).json({
      error: getUserIdFromJWTRes.error,
    });
  }

  User.findOne({ _id: getUserIdFromJWTRes.id })
    .then((user) => {
      if (user.game) {
        res.status(200).json({
          city: user.game.city,
        });
      } else {
        res.status(400).json({
          error: "No game has ever started",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
