const User = require("../models/user");
const { getUserIdFromJWT } = require("../utils/utils");

exports.getLeaderboardBestDay = (req, res, next) => {
  let leaderboard = [];
  User.find()
    .sort({
      "player.data.personal_best_day": -1,
      "player.data.personal_best_zb": -1,
    })
    .limit(10)
    .then((users) => {
      for (let i = 0; i < users.length; i++) {
        leaderboard.push({
          username: users[i].username,
          user_id: users[i]._id,
          personal_best_day: users[i].player.data.personal_best_day,
          personal_best_zb: users[i].player.data.personal_best_zb,
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
