class InventoryClass {
  constructor(inventory) {
    this.inventory = { ...inventory };
  }

  addsItems(key, nb) {
    if (this.inventory[key]) {
      this.inventory[key] += nb;
    } else {
      this.inventory.key = nb;
    }
  }

  containsInventory(inventoryClass) {
    // return this.inventory > inventory
    for (const key in inventoryClass.inventory) {
      //   console.log(key, inventoryClass.inventory[key]);
      if (!this.containsItems(key, inventoryClass.inventory[key])) {
        return false;
      }
    }
    return true;
  }

  containsItems(key, nb) {
    if (this.inventory[key]) {
      return nb <= this.inventory[key];
    } else {
      return false;
    }
  }

  addsInventory(inventoryClass) {
    for (const key in inventoryClass.inventory) {
      this.addsItems(key, inventoryClass.inventory[key]);
    }
  }

  substractsInventory(inventoryClass) {
    if (this.containsInventory(inventoryClass)) {
      for (const key in inventoryClass.inventory) {
        this.addsItems(key, -inventoryClass.inventory[key]);
      }
    } else {
      throw (
        "can't do: " +
        JSON.stringify(this.getObject()) +
        " - " +
        JSON.stringify(inventoryClass.getObject())
      );
    }
  }

  getObject() {
    return { ...this.inventory };
  }
}
//tests

function test(){
    let testInventory1 = new InventoryClass({ bois: 8, pierre: 7, metal: 2 });

    let testInventory2 = new InventoryClass({ bois: 8, pierre: 7, metal: 2 });
    let testInventory3 = new InventoryClass({ bois: 9, pierre: 7, metal: 1 });
    let testInventory4 = new InventoryClass({ bois: 7, pierre: 6, metal: 1 });
    
    console.log(testInventory1.containsItems("bois", 7), true);
    console.log(testInventory1.containsItems("bois", 8), true);
    console.log(testInventory1.containsItems("bois", 9), false);
    
    console.log("-------------------");
    
    console.log(testInventory1.containsInventory(testInventory2), true);
    console.log(testInventory2.containsInventory(testInventory1), true);
    console.log(testInventory1.containsInventory(testInventory3), false);
    console.log(testInventory1.containsInventory(testInventory4), true);
    console.log(testInventory2.containsInventory(testInventory4), true);
    console.log(testInventory4.containsInventory(testInventory2), false);
    
    console.log("-------------------");
    
    let testInventory5 = new InventoryClass({ bois: 3, pierre: 5, metal: 7 });
    let testInventory6 = new InventoryClass({ bois: 4, pierre: 6, metal: 8 });
    
    testInventory5.addsInventory(testInventory6);
    console.log(testInventory5.getObject(), { bois: 7, pierre: 11, metal: 15 });
    
    let testInventory7 = new InventoryClass({ bois: 7, pierre: 6, metal: 15 });
    let testInventory8 = new InventoryClass({ bois: 3, pierre: 5, metal: 7 });
    
    testInventory7.substractsInventory(testInventory8);
    console.log(testInventory7.getObject(), { bois: 4, pierre: 1, metal: 8 });
    
    console.log("next log is a log error");
    try {
      testInventory8.substractsInventory(testInventory7);
    } catch (e) {
      console.log(e);
    }
}

// test()

module.exports = InventoryClass




