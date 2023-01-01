const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  player: {
    type: Object({}),
    default: {
      data: { xp: 0, personal_best_day: 0, personal_best_zb: 0 },
      last_10_games: [],
      city: null,
    },
  },
  creation_date: { type: Date, default: Date.now },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
