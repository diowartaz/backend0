const User = require("../models/user");
const { getUserIdFromJWT } = require("../utils/utils");
const defaultValues = require("../utils/defaultValues");
const utils = require("../utils/utils");
const {
  findItemValidation,
  idValidation,
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
        user.player.city = utils.copyObject(defaultValues.newCity);
        for (let i = 0; i < 5; i++) {
          utils.addBuildingsCity(user.player.city, defaultValues.buildings);
        }
        user.player.city.last_timestamp_request = new Date().getTime();
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
        if (!user.player.city) {
          return res.status(400).json({
            error: "No city in progress",
          });
        }
        if (user.player.city.state == "recap") {
          return res.status(400).json({
            error: "Day didn't start yet",
          });
        }
        if (!user.player.city.alive) {
          return res.status(400).json({
            error: "You are dead",
          });
        }
        //calculer le temps de fouille
        let timeRequiredToFindItems =
          defaultValues.digging_time *
            req.params.nb *
            user.player.city.speeds.dig +
          Math.floor(
            ((new Date().getTime() - user.player.city.last_timestamp_request) *
              defaultValues.coef_realtime_to_ingametime) /
              1000
          );

        //si le temps de fouille depasse la fin de la journée alors return error
        if (
          timeRequiredToFindItems + user.player.city.time >
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
          user.player.city.time += timeRequiredToFindItems;
          //update le user
          user.player.city.last_timestamp_request = new Date().getTime();
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
      let { userNextDay, attackRecap } = utils.nextDay(user._doc);
      //update le user
      user.player.city.last_timestamp_request = new Date().getTime();
      User.updateOne({ _id: getUserIdFromJWTRes.id }, userNextDay)
        .then((updateOneResult) => {
          // res.status(200).json({ city: user.player.city, xp: user.player.data.xp });
          res.status(200).json({
            attackRecap,
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
    let idValidationRes = idValidation(req.params);
    if (idValidationRes.error) {
      return res
        .status(400)
        .json({ error: idValidationRes.error.details[0].message });
    }

    User.findOne({ _id: getUserIdFromJWTRes.id })
      .then((user) => {
        if (!user.player.city) {
          return res.status(400).json({
            error: "No city in progress",
          });
        }
        if (user.player.city.state == "recap") {
          return res.status(400).json({
            error: "Day didn't start yet",
          });
        }
        if (!user.player.city.alive) {
          return res.status(400).json({
            error: "You are dead",
          });
        }
        let buildId = req.params.id;
        //check if the building id is in the user.player.city.buildings
        let buildingUserWantsToBuild = null;
        for (const building of user.player.city.buildings) {
          if (building.id == buildId) {
            buildingUserWantsToBuild = building;
            break;
          }
        }
        if (!buildingUserWantsToBuild) {
          return res
            .status(400)
            .json({ error: "Building " + buildId + " not available" });
        }

        //check if building is not max-level
        if (buildingUserWantsToBuild.lvl == buildingUserWantsToBuild.lvl_max) {
          return res.status(400).json({
            error: "Building " + buildId + " is alrealdy at its max level",
          });
        }
        let timeRequiredToBuild =
          buildingUserWantsToBuild.time * user.player.city.speeds.build +
          Math.floor(
            ((new Date().getTime() - user.player.city.last_timestamp_request) *
              defaultValues.coef_realtime_to_ingametime) /
              1000
          );
        //check if user has time to build
        if (
          timeRequiredToBuild + user.player.city.time >
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
            buildingUserWantsToBuild.inventory
          )
        ) {
          return res.status(400).json({
            error: "Building " + buildId + " not enought ressouces",
          });
        }

        //build lvl++
        buildingUserWantsToBuild.lvl++;

        //we substract the building ressources to user.player.city.inventory
        utils.minus(
          user.player.city.inventory,
          buildingUserWantsToBuild.inventory
        );

        // add time to user.player.city.time
        user.player.city.time += timeRequiredToBuild;

        // add defense to user.player.city.defense
        user.player.city.defense += buildingUserWantsToBuild.defense;

        //update with the new city
        user.player.city.last_timestamp_request = new Date().getTime();
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

exports.learn = (req, res, next) => {
  try {
    let getUserIdFromJWTRes = getUserIdFromJWT(req);
    if (getUserIdFromJWTRes.error) {
      return res.status(400).json({
        error: getUserIdFromJWTRes.error,
      });
    }
    let idValidationRes = idValidation(req.params);
    if (idValidationRes.error) {
      return res
        .status(400)
        .json({ error: idValidationRes.error.details[0].message });
    }

    User.findOne({ _id: getUserIdFromJWTRes.id })
      .then((user) => {
        if (!user.player.city) {
          return res.status(400).json({
            error: "No city in progress",
          });
        }
        if (user.player.city.state == "recap") {
          return res.status(400).json({
            error: "Day didn't start yet",
          });
        }
        if (!user.player.city.alive) {
          return res.status(400).json({
            error: "You are dead",
          });
        }
        let skillId = req.params.id;
        //check if the skill id is in the user.player.city.skills
        let skillUserWantsToLearn = null;
        for (const skill of user.player.city.skills) {
          if (skill.id == skillId) {
            skillUserWantsToLearn = skill;
            break;
          }
        }
        if (!skillUserWantsToLearn) {
          return res
            .status(400)
            .json({ error: "Skill " + skillId + " not available" });
        }

        //check if building is not max-level
        if (skillUserWantsToLearn.lvl == skillUserWantsToLearn.lvl_max) {
          return res.status(400).json({
            error: "Skill " + skillId + " is alrealdy at its max level",
          });
        }

        let timeRequiredToLearn =
          skillUserWantsToLearn.time * user.player.city.speeds.learn +
          Math.floor(
            ((new Date().getTime() - user.player.city.last_timestamp_request) *
              defaultValues.coef_realtime_to_ingametime) /
              1000
          );
        //check if user has time to skill
        if (
          timeRequiredToLearn + user.player.city.time >
          defaultValues.day_end_time
        ) {
          return res.status(400).json({
            error: "Skill " + skillId + " not enought time to learn",
          });
        }

        //skill lvl++
        skillUserWantsToLearn.lvl++;

        // add time to user.player.city.time
        user.player.city.time += timeRequiredToLearn;

        // modify player speeds
        user.player.city.speeds[skillUserWantsToLearn.speed_name] =
          user.player.city.speeds[skillUserWantsToLearn.speed_name] -
          skillUserWantsToLearn.avantage_per_lvl;

        //update with the new city
        user.player.city.last_timestamp_request = new Date().getTime();
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

exports.dayEnd = (req, res, next) => {
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
      if (user.player.city.state == "recap") {
        return res.status(400).json({
          error: "Day didn't start yet",
        });
      }
      if (!user.player.city.alive) {
        return res.status(400).json({
          error: "You are dead",
        });
      }
      let { userNextDay } = utils.nextDay(user._doc);
      //update le user
      User.updateOne({ _id: getUserIdFromJWTRes.id }, userNextDay)
        .then((updateOneResult) => {
          res.status(200).json({
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

exports.dayStart = (req, res, next) => {
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
      if (user.player.city.state == "inProgress") {
        return res.status(400).json({
          error: "Day has alrealdy started",
        });
      }
      if (!user.player.city.alive) {
        return res.status(400).json({
          error: "You are dead",
        });
      }
      user.player.city.state = "inProgress";
      user.player.city.last_timestamp_request = new Date().getTime();
      //update le user
      User.updateOne({ _id: getUserIdFromJWTRes.id }, user)
        .then((updateOneResult) => {
          res.status(200).json({
            city: user.player.city,
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
