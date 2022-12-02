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

function nextDay(user) {
  let userNextDay = { ...user };
  userNextDay.city.day += 1;
  userNextDay.city.time = defaultValues.day_start_time;
  userNextDay.city.nb_zb_previous_attack =
    userNextDay.city.nb_zb_previous_attack +
    getRandomIntMinMax(userNextDay.city.day * 2, userNextDay.city.day * 4);
  userNextDay.city.nb_zb_next_attack_min =
    userNextDay.city.nb_zb_previous_attack + (userNextDay.city.day + 1) * 2;
  userNextDay.city.nb_zb_next_attack_max =
    userNextDay.city.nb_zb_previous_attack + (userNextDay.city.day + 1) * 4;

  userNextDay.city.nb_zb_history.push(userNextDay.city.nb_zb_previous_attack);
  return userNextDay;
}

module.exports = {
  getUserIdFromJWT,
  randomInventory,
  combineInventories,
  nextDay,
};
