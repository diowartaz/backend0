const InventoryClass = require("./inventory");

class Building {
  constructor(name, defense, maxLevel, ressourcesRequired, timeRequired) {
    this.name = name;
    this.defense = defense;
    this.level = 0;
    this.maxLevel = maxLevel;
    this.ressourcesRequired = ressourcesRequired;
    this.timeRequired = timeRequired;
  }

  log() {
    console.log(this);
  }

  canBeBuilt(inventoryClass) {
    return this.level < this.maxLevel;
  }

  build() {
    if (this.canBeBuilt()) {
      this.level++;
    } else {
      throw "can't be built";
    }
  }
}

function test() {
  let building1 = new Building("palissade", 25, 4, new InventoryClass({}), 4);
  building1.build();
  building1.log();
  console.log("test");
}

test();
