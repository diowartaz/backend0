const User = require("../models/user");
const { getUserIdFromJWT } = require("../utils/utils");

exports.getLeaderboard = (req, res, next) => {
  let leaderboard = [];
  User.find()
    .sort({ xp: -1 })
    .limit(10)
    .then((users) => {
      for (let i = 0; i < users.length; i++) {
        leaderboard.push({
          username: users[i].username,
          xp: users[i].xp,
          rank: i + 1,
        });
      }
      res.status(200).json({ leaderboard: leaderboard });
    });
};

exports.userXP = (req, res, next) => {
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
