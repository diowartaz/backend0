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
  city: { type: Object({}) },
  creation_date: { type: Date, default: Date.now },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
