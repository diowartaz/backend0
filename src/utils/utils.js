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
  try {
    let userNextDay = { ...user };
    let attackRecap = {
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
      userNextDay.player.city = null;
      return { userNextDay, attackRecap };
    }
    //update day
    userNextDay.player.city.day += 1;
    //update time
    userNextDay.player.city.time = defaultValues.day_start_time;
    //update nb zb
    userNextDay.player.city.nb_zb_previous_attack = attackRecap.nb_zb;

    userNextDay.player.city.nb_zb_next_attack_min =
      userNextDay.player.city.nb_zb_previous_attack +
      (userNextDay.player.city.day + 1) * 2;
    userNextDay.player.city.nb_zb_next_attack_max =
      userNextDay.player.city.nb_zb_previous_attack +
      (userNextDay.player.city.day + 1) * 4;

    //update nb_zb_history
    userNextDay.player.city.nb_zb_history.push(
      userNextDay.player.city.nb_zb_previous_attack
    );

    userNextDay.player.city.state = "recap";
    userNextDay.player.city.attackRecap = attackRecap;
    return { userNextDay, attackRecap };
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getUserIdFromJWT,
  randomInventory,
  combineInventories,
  nextDay,
  contains,
  minus,
};
