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
  city: {
    type: Object({
      inventory: {
        type: Object({
          wood: Number,
          cement_bag: Number,
          metal: Number,
          srew: Number,
          adhesive_patch: Number,
        }),
        // default: {
        //   wood: 0,
        //   cement_bag: 0,
        //   metal: 0,
        //   srew: 0,
        //   adhesive_patch: 0,
        // },
      },
    }),
    required: true,
    default: {
      inventory: {
        wood: 0,
        cement_bag: 0,
        metal: 0,
        srew: 0,
        adhesive_patch: 0,
      },
    },
  },
  creation_date: { type: Date, default: Date.now },
});

userSchema.methods.listUser = function () {
  return mongoose.model("User").find();
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
