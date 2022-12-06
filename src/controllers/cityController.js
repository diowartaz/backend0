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
      if (user.player && user.player.city) {
        res.status(400).json({
          error: "City already in progress",
        });
      } else {
        if (!user.player) {
          user.player = {
            xp: 0,
            city: null,
          };
        }
        user.player.city = { ...defaultValues.newCity };
        User.updateOne({ _id: id }, user)
          .then((updateOneResult) => {
            res.status(200).json({ player: user.player });
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
      if (user.player && user.player.city) {
        if (!user.player) {
          user.player = {
            xp: 0,
          };
        }
        user.player.city = null;
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
        let find_items_time = defaultValues.digging_time * req.params.nb;
        //si le temps de fouille depasse la fin de la journée alors return error
        if (
          find_items_time + user.player.city.time >
          defaultValues.day_end_time
        ) {
          return res.status(400).json({
            error: "Not enough time",
          });
          //si ok
        } else {
          //generer la liste des items trouvés
          let items_found_inventory = utils.randomInventory(req.params.nb);
          //ajout cette liste à user.player.city.inventory
          user.player.city.inventory = utils.combineInventories(
            user.player.city.inventory,
            items_found_inventory
          );
          user.player.city.time += find_items_time;
          //update le user
          User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
            .then((updateOneResult) => {
              res.status(200).json({
                city: user.player.city,
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
      if (!user.player.city) {
        return res.status(400).json({
          error: "No city in progress",
        });
      }
      console.log("utils.nextDay");
      let { userNextDay, attackResult } = utils.nextDay(user._doc);
      //update le user
      User.updateOne({ _id: getUserIdFromJWTRes.id }, userNextDay)
        .then((updateOneResult) => {
          // res.status(200).json({ city: user.player.city, xp: user.player.data.xp });
          res.status(200).json({
            attackResult,
            player: userNextDay.player,
          });
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
        //check if the building id is in the user.player.city.buildings
        let buildingUserWantToBuild = null;
        for (const building of user.player.city.buildings) {
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
          buildingUserWantToBuild.time * user.player.city.speeds.build +
            user.player.city.time >
          defaultValues.day_end_time
        ) {
          return res.status(400).json({
            error: "Building " + buildId + " not enought time to build",
          });
        }

        //check if user.player.city.inventory has the item
        if (
          !utils.contains(
            user.player.city.inventory,
            buildingUserWantToBuild.inventory
          )
        ) {
          return res.status(400).json({
            error: "Building " + buildId + " not enought ressouces",
          });
        }

        //build lvl++
        buildingUserWantToBuild.lvl++;

        //we substract the building ressources to user.player.city.inventory
        utils.minus(
          user.player.city.inventory,
          buildingUserWantToBuild.inventory
        );

        // add time to user.player.city.time
        user.player.city.time +=
          buildingUserWantToBuild.time * user.player.city.speeds.build;

        // add defense to user.player.city.defense
        user.player.city.defense += buildingUserWantToBuild.defense;

        //update with the new city
        User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
          .then((updateOneResult) => {
            res.status(200).json({ city: user.player.city });
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
