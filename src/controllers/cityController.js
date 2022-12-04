const User = require("../models/user");
const { getUserIdFromJWT } = require("../utils/utils");
const defaultValues = require("../utils/defaultValues");
const utils = require("../utils/utils");
const { findItemValidation } = require("../validation/cityValidators");

exports.new = (req, res, next) => {
  const { error, id } = getUserIdFromJWT(req);
  if (error) {
    return res.status(400).json({
      error: error,
    });
  }

  User.findOne({ _id: id })
    .then((user) => {
      if (user.game && user.game.city) {
        res.status(400).json({
          error: "City already in progress",
        });
      } else {
        if (!user.game) {
          user.game = {
            xp: 0,
            city: null,
          };
        }
        user.game.city = { ...defaultValues.newCity };
        User.updateOne({ _id: id }, user)
          .then((updateOneResult) => {
            res.status(200).json({ game: user.game });
          })
          .catch((error) => {
            res.status(400).json({
              error: error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.delete = (req, res, next) => {
  const { error, id } = getUserIdFromJWT(req);
  if (error) {
    return res.status(400).json({
      error: error,
    });
  }

  User.findOne({ _id: id })
    .then((user) => {
      if (user.game && user.game.city) {
        if (!user.game) {
          user.game = {
            xp: 0,
          };
        }
        user.game.city = null;
        User.updateOne({ _id: id }, user)
          .then((updateOneResult) => {
            res.status(200).json({ message: "Your city was deleted" });
          })
          .catch((error) => {
            res.status(400).json({
              error: error,
            });
          });
      } else {
        res.status(400).json({
          error: "No city is in progress",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.findItem = (req, res, next) => {
  try {
    let getUserIdFromJWTRes = getUserIdFromJWT(req);
    if (getUserIdFromJWTRes.error) {
      return res.status(400).json({
        error: getUserIdFromJWTRes.error,
      });
    }
    let findItemValidationRes = findItemValidation(req.params);
    if (findItemValidationRes.error) {
      return res
        .status(400)
        .json({ error: findItemValidationRes.error.details[0].message });
    }

    User.findOne({ _id: getUserIdFromJWTRes.id })
      .then((user) => {
        //calculer le temps de fouille
        let find_items_time = defaultValues.find_item_time * req.params.nb;
        //si le temps de fouille depasse la fin de la journée alors return error
        if (
          find_items_time + user.game.city.time >=
          defaultValues.day_end_time
        ) {
          return res.status(400).json({
            error: "Not enough time",
          });
          //si ok
        } else {
          //generer la liste des items trouvés
          let items_found_inventory = utils.randomInventory(req.params.nb);
          //ajout cette liste à user.game.city.inventory
          user.game.city.inventory = utils.combineInventories(
            user.game.city.inventory,
            items_found_inventory
          );
          user.game.city.time += find_items_time;
          //update le user
          User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
            .then((updateOneResult) => {
              //retourner le user sans le password
              user.password = null;
              res.status(200).json({
                new_city_inventory: user.game.city.inventory,
                items_found_inventory,
                new_city_time: user.game.city.time,
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
              });
            });
        }
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

exports.waitForTheAttack = (req, res, next) => {
  let getUserIdFromJWTRes = getUserIdFromJWT(req);
  if (getUserIdFromJWTRes.error) {
    return res.status(400).json({
      error: getUserIdFromJWTRes.error,
    });
  }

  User.findOne({ _id: getUserIdFromJWTRes.id })
    .then((user) => {
      user = utils.nextDay(user._doc);
      //update le user
      User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
        .then((updateOneResult) => {
          res.status(200).json({ game: user.game });
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
exports.build = (req, res, next) => {
  let getUserIdFromJWTRes = getUserIdFromJWT(req);
  if (getUserIdFromJWTRes.error) {
    return res.status(400).json({
      error: getUserIdFromJWTRes.error,
    });
  }

  User.findOne({ _id: getUserIdFromJWTRes.id })
    .then((user) => {
      //check if the building id is in the user.game.city.buildings
      //check if user.game.city.inventory has the item and max-level
      //check if user has time to build

      //build lvl++
      //we substract the building ressources to user.game.city.inventory
      // add time to user.game.city.time

      //update with the new city
      User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
        .then((updateOneResult) => {
          //retourner le user sans le password
          user.password = null;
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
