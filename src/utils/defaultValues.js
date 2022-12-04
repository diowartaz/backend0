const items = ["wood", "metal", "stone", "srew", "patch"];

const palissade = {
  defense: 25,
  lvl: 0,
  lvl_max: 3,
  time: 2 * 60 * 60,
  ressouces: {
    wood: 2,
    metal: 3,
    screw: 1,
  },
};

const hugePit = {
  defense: 15,
  lvl: 0,
  lvl_max: 4,
  time: 5 * 60 * 60,
  ressouces: {},
};

const giantWall = {
  defense: 40,
  lvl: 0,
  lvl_max: 2,
  time: 2 * 60 * 60,
  ressouces: {
    wood: 5,
    metal: 5,
    stone: 2,
  },
};

const renforcedWall = {
  defense: 45,
  lvl: 0,
  lvl_max: 3,
  time: 4 * 60 * 60,
  ressouces: {
    srew: 2,
    metal: 3,
    stone: 4,
  },
};

const barricade = {
  defense: 10,
  lvl: 0,
  lvl_max: 5,
  time: 1 * 60 * 60,
  ressouces: {
    wood: 2,
    metal: 1,
  },
};

const buildings = [palissade, hugePit, giantWall, renforcedWall, barricade];

const newCity = {
  day: 1,
  defense: 57,
  buildings: [],
  nb_zb_history: [],
  nb_zb_previous_attack: 9,
  nb_zb_next_attack_min: 13,
  nb_zb_next_attack_max: 17,
  time: 5 * 60 * 60, //6h du mat
  inventory: { wood: 0, stone: 0, screw: 0, metal: 0, patch: 0 },
  speeds: {
    build: 1,
    learn: 1,
  },
};

const defaultValues = {
  newCity,
  items,
  find_item_time: 1 * 60 * 60,
  day_start_time: 5 * 60 * 60,
  day_end_time: 21 * 60 * 60,
};

module.exports = defaultValues;
