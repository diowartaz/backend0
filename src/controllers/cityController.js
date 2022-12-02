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
      if (user.city) {
        res.status(400).json({
          error: "City already in progress",
        });
      } else {
        user.city = { ...defaultValues.newCity };
        User.updateOne({ _id: id }, user)
          .then((updateOneResult) => {
            user.password = null;
            res.status(200).json({ user: user });
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
      if (user.city) {
        user.city = null;
        User.updateOne({ _id: id }, user)
          .then((updateOneResult) => {
            user.password = null;
            res.status(200).json({ user: user });
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
        if (find_items_time + user.city.time >= defaultValues.day_end_time) {
          return res.status(400).json({
            error: "Not enough time",
          });
          //si ok
        } else {
          //generer la liste des items trouvés
          let items_found_inventory = utils.randomInventory(req.params.nb);
          //ajout cette liste à user.city.inventory
          user.city.inventory = utils.combineInventories(
            user.city.inventory,
            items_found_inventory
          );
          user.city.time += find_items_time;
          //update le user
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
