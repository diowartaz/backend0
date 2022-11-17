const defaultListIem = ["wood", "metal", "srew", "cement_bag"];
const defaultInventory = {
  wood: 0,
  metal: 0,
  srew: 0,
  cement_bag: 0,
};

function getDefaultListIem() {
  return [...defaultListIem];
}

function getDefaultInventory() {
  return { ...defaultInventory };
}

// exports defaultListIem;
module.exports = { getDefaultListIem, getDefaultInventory };
