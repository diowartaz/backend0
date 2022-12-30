const defaultValues = require("./defaultValues");
const jwt = require("jsonwebtoken");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntMinMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem() {
  return defaultValues.items[getRandomInt(defaultValues.items.length)];
}

function getUserIdFromJWT(req) {
  let res = {
    error: null,
    id: null,
  };
  try {
    let token = req.headers.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    res.id = decoded.id;
    return res;
  } catch (error) {
    res.error = error;
    return res;
  }
}

function combineInventories(inv1, inv2) {
  let inventory = { ...inv2 };
  for (let property in inv1) {
    if (inventory[property]) {
      inventory[property] += inv1[property];
    } else {
      inventory[property] = inv1[property];
    }
  }
  return inventory;
}

function randomInventory(nb_items) {
  let inventory = {};
  for (let i = 0; i < nb_items; i++) {
    let random_item = getRandomItem();
    if (inventory[random_item]) {
      inventory[random_item] += 1;
    } else {
      inventory[random_item] = 1;
    }
  }
  return inventory;
}

function contains(inv1, inv2) {
  //return inv1 >= inv2
  for (const itemName in inv2) {
    if (!(inv1.hasOwnProperty(itemName) && inv1[itemName] >= inv2[itemName])) {
      return false;
    }
  }
  return true;
}

//tests
// let test_inv_1 = { wood: 2, stone: 3, patch: 4 };
// let test_inv_2 = { wood: 2, stone: 3, patch: 4 };
// let test_inv_3 = { wood: 5, stone: 3, patch: 4 };
// let test_inv_4 = { wood: 2, stone: 3, patch: 1 };

// let test_inv_5 = { wood: 2, stone: 3, patch: 4, fzefzef: 2 };

// console.log(contains(test_inv_1, test_inv_2));
// console.log(contains(test_inv_2, test_inv_1));

// console.log(contains(test_inv_1, test_inv_3) == false);
// console.log(contains(test_inv_3, test_inv_1));

// console.log(contains(test_inv_1, test_inv_4));
// console.log(contains(test_inv_4, test_inv_1) == false);

// console.log(contains(test_inv_1, test_inv_5) == false);
// console.log(contains(test_inv_5, test_inv_1) == true);

function minus(inv1, inv2) {
  for (const itemName in inv2) {
    inv1[itemName] -= inv2[itemName];
  }
}

function nextDay(user) {
  // 25 33
  try {
    let userNextDay = { ...user };
    let attackRecap = {
      architect_shelter_buildings: [],
      nb_zb:
        userNextDay.player.city.nb_zb_previous_attack +
        getRandomIntMinMax(
          userNextDay.player.city.day * 2,
          userNextDay.player.city.day * 4
        ),
      defense: userNextDay.player.city.defense,
      alive: true,
      player_xp: 0,
      day: userNextDay.player.city.day,
    };

    //check if user is dead
    if (userNextDay.player.city.defense < attackRecap.nb_zb) {
      //user is dead
      attackRecap.alive = false;
      userNextDay.player.city.alive = false;
      //add xp
      attackRecap.player_xp = 0;
      for (const nb_zb of userNextDay.player.city.nb_zb_history) {
        attackRecap.player_xp += nb_zb;
      }
      userNextDay.player.data.xp += attackRecap.player_xp;

      //update reccord zombie
      if (userNextDay.player.data.personal_best_zb) {
        if (
          userNextDay.player.data.personal_best_zb <
          userNextDay.player.city.nb_zb_previous_attack
        ) {
          userNextDay.player.data.personal_best_zb =
            userNextDay.player.city.nb_zb_previous_attack;
        }
      } else {
        userNextDay.player.data.personal_best_zb =
          userNextDay.player.city.nb_zb_previous_attack;
      }

      //update reccord day
      if (userNextDay.player.data.personal_best_day) {
        if (
          userNextDay.player.data.personal_best_day <
          userNextDay.player.city.day
        ) {
          userNextDay.player.data.personal_best_day =
            userNextDay.player.city.day;
        }
      } else {
        userNextDay.player.data.personal_best_day = userNextDay.player.city.day;
      }
      // userNextDay.player.city = null;
      // return { userNextDay };
    } else {
      //update nb_zb_history
      userNextDay.player.city.nb_zb_history.push(
        userNextDay.player.city.nb_zb_previous_attack
      );

      let lvl_architect_shelter = 0;

      if ((userNextDay.player.city.buildings[0].id = 16)) {
        lvl_architect_shelter = userNextDay.player.city.buildings[0].lvl;
      }
      for (let i = 0; i < lvl_architect_shelter; i++) {
        if (Math.random() > 0.5) {
          let buildingAdded = addBuildingsCity(
            userNextDay.player.city,
            defaultValues.buildings
          );
          if (buildingAdded) {
            attackRecap.architect_shelter_buildings.push(buildingAdded);
          }
        }
      }
    }
    //update day
    userNextDay.player.city.day += 1;
    //update time
    userNextDay.player.city.time = defaultValues.day_start_time;
    //update nb zb
    userNextDay.player.city.nb_zb_previous_attack = attackRecap.nb_zb;

    userNextDay.player.city.nb_zb_next_attack_min =
      userNextDay.player.city.nb_zb_previous_attack +
      userNextDay.player.city.day * 2;
    userNextDay.player.city.nb_zb_next_attack_max =
      userNextDay.player.city.nb_zb_previous_attack +
      userNextDay.player.city.day * 4;

    userNextDay.player.city.state = "recap";
    userNextDay.player.city.attackRecap = attackRecap;
    return { userNextDay };
  } catch (e) {
    console.log(e);
  }
}

function addBuildingsCity(city, listBuilding) {
  let buildingsAvailable = [];
  for (let i = 0; i < listBuilding.length; i++) {
    let isAvailable = true;
    for (let j = 0; j < city.buildings.length; j++) {
      if (listBuilding[i].id == city.buildings[j].id) {
        isAvailable = false;
        break;
      }
    }
    if (isAvailable) {
      buildingsAvailable.push(listBuilding[i]);
    }
  }
  if (buildingsAvailable.length == 0) {
    return null;
  }
  let buildingToAdd =
    buildingsAvailable[getRandomIntMinMax(0, buildingsAvailable.length - 1)];
  buildingToAdd.defense = randomizeInt(buildingToAdd.defense, 20);
  for (let i = 0; i < city.buildings.length; i++) {
    sort1[city.buildings[i].rarity] = i;
  }
  city.buildings.push(buildingToAdd);
  city.buildings.sort(compareSortBuildings);
  return buildingToAdd;
}

function compareSortBuildings(building1, building2) {
  let comparisionCriteria = {
    base: 0,
    epic: 1,
    rare: 2,
    common: 3,
  };
  if (
    comparisionCriteria[building1.rarity] <
    comparisionCriteria[building2.rarity]
  ) {
    return -1;
  }
  if (
    comparisionCriteria[building1.rarity] >
    comparisionCriteria[building2.rarity]
  ) {
    return 1;
  }
  return 0;
}

function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function randomizeInt(nb, percentage) {
  let random_coef =
    (Math.random() * percentage * 2) / 100 + (1 - percentage / 100);
  return Math.round(Math.max(0, nb * random_coef));
}

module.exports = {
  getUserIdFromJWT,
  randomInventory,
  combineInventories,
  nextDay,
  contains,
  minus,
  addBuildingsCity,
  copyObject,
};
