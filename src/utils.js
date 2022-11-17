const defaultValues = require("./defaultValues");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomItem() {
  const listIem = defaultValues.getDefaultListIem();
  return listIem[getRandomInt(listIem.length - 1)];
}

class City {
  inventory;
  last_update_date;
  constructor(city) {
    if (city) {
      this.inventory = city.inventory;
      this.last_update_date = city.last_update_date;
    } else {
      this.inventory = defaultValues.getDefaultInventory();
      this.last_update_date = new Date();
    }
  }

  log() {
    console.log(this.getObject());
  }

  addItemToInventory(item, nb) {
    //item : string, nb: number
    success = true;
    if (this.inventory[item]) {
      if (this.inventory[item] + nb >= 0) {
        this.inventory[item] += this.inventory[item];
      } else {
        sucess = false;
      }
    } else {
      if (nb >= 0) {
        this.inventory[item] = nb;
      } else {
        sucess = false;
      }
    }
    return success;
  }

  searchForItemsValidation(nb) {
    return true;
  }

  searchForItems(nb) {
    let itemsFound = {};
    for (let i = 0; i < nb; i++) {
      let itemFound = getRandomItem();
      let items = defaultValues.getDefaultInventory();
      items[itemFound] = items[itemFound] + 1;
      this.addItemToInventory(itemFound);
    }
    return items;
  }

  getObject() {
    let res = {
      inventory: this.inventory,
    };
    return res;
  }
}

module.exports = { City };
