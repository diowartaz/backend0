const User = require("../models/user");
const { getUserIdFromJWT } = require("../utils/utils");
const defaultValues = require("../utils/defaultValues");
const utils = require("../utils/utils");
const {
  findItemValidation,
  buildValidation,
} = require("../validation/cityValidators");

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
          find_items_time + user.game.city.time >
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
              res.status(200).json({
                city: user.game.city,
                items_found_inventory,
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
          res.status(200).json({ city: user.game.city, xp: user.game.xp });
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
  try {
    let getUserIdFromJWTRes = getUserIdFromJWT(req);
    if (getUserIdFromJWTRes.error) {
      return res.status(400).json({
        error: getUserIdFromJWTRes.error,
      });
    }
    let buildValidationRes = buildValidation(req.params);
    if (buildValidationRes.error) {
      return res
        .status(400)
        .json({ error: buildValidationRes.error.details[0].message });
    }

    User.findOne({ _id: getUserIdFromJWTRes.id })
      .then((user) => {
        let buildId = req.params.id;
        //check if the building id is in the user.game.city.buildings
        let buildingUserWantToBuild = null;
        for (const building of user.game.city.buildings) {
          if (building.id == buildId) {
            buildingUserWantToBuild = building;
            break;
          }
        }
        if (!buildingUserWantToBuild) {
          return res
            .status(400)
            .json({ error: "Building " + buildId + " not available" });
        }

        //check if building is not max-level
        if (buildingUserWantToBuild.lvl == buildingUserWantToBuild.lvl_max) {
          return res.status(400).json({
            error: "Building " + buildId + " is alrealdy at its max level",
          });
        }

        //check if user has time to build
        if (
          buildingUserWantToBuild.time * user.game.city.speeds.build +
            user.game.city.time >
          defaultValues.day_end_time
        ) {
          return res.status(400).json({
            error: "Building " + buildId + " not enought time to build",
          });
        }

        //check if user.game.city.inventory has the item
        if (
          !utils.contains(
            user.game.city.inventory,
            buildingUserWantToBuild.inventory
          )
        ) {
          return res.status(400).json({
            error: "Building " + buildId + " not enought ressouces",
          });
        }

        //build lvl++
        buildingUserWantToBuild.lvl++;

        //we substract the building ressources to user.game.city.inventory
        utils.minus(
          user.game.city.inventory,
          buildingUserWantToBuild.inventory
        );

        // add time to user.game.city.time
        user.game.city.time +=
          buildingUserWantToBuild.time * user.game.city.speeds.build;

        // add defense to user.game.city.defense
        user.game.city.defense += buildingUserWantToBuild.defense;

        //update with the new city
        User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
          .then((updateOneResult) => {
            res.status(200).json({ city: user.game.city });
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
  } catch (e) {
    console.log(e);
  }
};

exports.getDefaultValues = (req, res, next) => {
  let getUserIdFromJWTRes = getUserIdFromJWT(req);
  if (getUserIdFromJWTRes.error) {
    return res.status(400).json({
      error: getUserIdFromJWTRes.error,
    });
  }

  User.findOne({ _id: getUserIdFromJWTRes.id })
    .then((user) => {
      res.status(200).json({ default_values: defaultValues });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
