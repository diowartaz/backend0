const items = ["wood", "metal", "stone", "screw", "patch"];

const palissade = {
  id: 1,
  rarity: "common",
  name: "Palissade",
  defense: 25,
  lvl: 0,
  lvl_max: 3,
  time: 2 * 60 * 60,
  inventory: {
    wood: 2,
    metal: 3,
    screw: 1,
  },
};

const hugePit = {
  id: 2,
  rarity: "common",
  name: "Huge pit",
  defense: 15,
  lvl: 0,
  lvl_max: 4,
  time: 8 * 60 * 60,
  inventory: {},
};

const giantWall = {
  id: 3,
  rarity: "common",
  name: "Giant wall",
  defense: 40,
  lvl: 0,
  lvl_max: 2,
  time: 2 * 60 * 60,
  inventory: {
    wood: 5,
    metal: 5,
    stone: 2,
  },
};

const renforcedWall = {
  id: 4,
  rarity: "rare",
  name: "Renforced wall",
  defense: 45,
  lvl: 0,
  lvl_max: 3,
  time: 4 * 60 * 60,
  inventory: {
    screw: 2,
    metal: 3,
    stone: 4,
  },
};

const barricade = {
  id: 5,
  rarity: "common",
  name: "Barricade",
  defense: 10,
  lvl: 0,
  lvl_max: 5,
  time: 1 * 60 * 60,
  inventory: {
    wood: 2,
    metal: 1,
  },
};

const fake_town = {
  id: 6,
  rarity: "epic",
  name: "Fake town",
  defense: 180,
  lvl: 0,
  lvl_max: 1,
  time: 25 * 60 * 60,
  inventory: {
    wood: 5,
    metal: 5,
    stone: 5,
    screw: 5,
  },
};

const trenches = {
  id: 7,
  rarity: "rare",
  name: "Trenches",
  defense: 50,
  lvl: 0,
  lvl_max: 3,
  time: 24 * 60 * 60,
  inventory: {},
};

const random_pits = {
  id: 8,
  rarity: "common",
  name: "Random Pits",
  defense: 5,
  lvl: 0,
  lvl_max: 3,
  time: 3 * 60 * 60,
  inventory: {},
};

const bunker = {
  id: 9,
  rarity: "rare",
  name: "Bunker",
  defense: 50,
  lvl: 0,
  lvl_max: 3,
  time: 10 * 60 * 60,
  inventory: {
    wood: 1,
    metal: 2,
    stone: 2,
  },
};

const piles_of_debris = {
  id: 10,
  rarity: "common",
  name: "Piles of Debris",
  defense: 20,
  lvl: 0,
  lvl_max: 3,
  time: 3 * 60 * 60,
  inventory: {
    wood: 2,
    metal: 1,
    patch: 1,
    screw: 1,
  },
};

const sharpened_stakes = {
  id: 11,
  rarity: "rare",
  name: "Sharpened Stakes",
  defense: 30,
  lvl: 0,
  lvl_max: 3,
  time: 6 * 60 * 60,
  inventory: {
    wood: 2,
    metal: 2,
  },
};

const reinforcing_beams = {
  id: 12,
  rarity: "epic",
  name: "Reinforcing Beams",
  defense: 20,
  lvl: 0,
  lvl_max: 3,
  time: 2 * 60 * 60,
  inventory: {
    wood: 3,
  },
};

const big_wall = {
  id: 13,
  rarity: "common",
  name: "Big Wall",
  defense: 35,
  lvl: 0,
  lvl_max: 3,
  time: 5 * 60 * 60,
  inventory: {
    wood: 2,
    metal: 2,
    stone: 2,
    screw: 1,
  },
};

const zombies_grater = {
  id: 14,
  rarity: "epic",
  name: "Zombies Grater",
  defense: 60,
  lvl: 0,
  lvl_max: 3,
  time: 10 * 60 * 60,
  inventory: {
    metal: 2,
    screw: 3,
    patch: 3,
  },
};

const barbed_wires = {
  id: 15,
  rarity: "epic",
  name: "Barbed Wires",
  defense: 15,
  lvl: 0,
  lvl_max: 3,
  time: 2 * 60 * 60,
  inventory: {
    metal: 2,
  },
};

const architect_shelter = {
  id: 16,
  rarity: "base",
  name: "Architect Shelter",
  defense: 0,
  lvl: 0,
  lvl_max: 3,
  time: 5 * 60 * 60,
  inventory: {
    metal: 2,
    screw: 2,
    patch: 2,
  },
};

const digger = {
  id: 1,
  name: "Digger",
  speed_name: "dig",
  lvl: 0,
  lvl_max: 5,
  time: 4 * 60 * 60,
  avantage_per_lvl: 0.1,
};

const fast_leaner = {
  id: 2,
  name: "Fast Learner",
  speed_name: "learn",
  lvl: 0,
  lvl_max: 5,
  time: 4 * 60 * 60,
  avantage_per_lvl: 0.1,
};

const builder = {
  id: 3,
  name: "Builder",
  speed_name: "build",
  lvl: 0,
  lvl_max: 5,
  time: 2 * 60 * 60,
  avantage_per_lvl: 0.1,
};

const meditator = {
  id: 4,
  name: "Meditator",
  speed_name: "meditate",
  lvl: 0,
  lvl_max: 5,
  time: 4 * 60 * 60,
  avantage_per_lvl: 0.1,
};

const common_buildings = [
  palissade,
  hugePit,
  giantWall,
  renforcedWall,
  barricade,
  fake_town,
  trenches,
  random_pits,
  bunker,
  piles_of_debris,
  sharpened_stakes,
  reinforcing_beams,
  big_wall,
  zombies_grater,
  barbed_wires,
];
const rare_buildings = [];
const epic_buildings = [];

const buildings = common_buildings
  .concat(rare_buildings)
  .concat(epic_buildings);

const skills = [digger, fast_leaner, builder];

const day_start_time = 8 * 60 * 60;
const day_end_time = 24 * 60 * 60 + 59;

const newCity = {
  day: 1,
  defense: 20,
  buildings: [architect_shelter],
  skills: skills,
  nb_zb_history: [],
  nb_zb_previous_attack: 9,
  nb_zb_next_attack_min: 11,
  nb_zb_next_attack_max: 13,
  time: day_start_time,
  // inventory: { wood: 99, stone: 99, screw: 99, metal: 99, patch: 99 },
  inventory: { wood: 0, stone: 0, screw: 0, metal: 0, patch: 0 },
  speeds: {
    build: 1,
    learn: 1,
    dig: 1,
    meditate: 1,
  },
  last_timestamp_request: null,
  state: "inProgress",
  alive: true,
};

const realTimeDay = 5 * 60;
const coef_realtime_to_ingametime = Math.floor(
  (day_end_time - day_start_time) / realTimeDay
); //192

const defaultValues = {
  newCity,
  items,
  day_start_time,
  day_end_time,
  digging_time: 2 * 60 * 60,
  coef_realtime_to_ingametime,
  nb_building_at_start: 5,
  buildings,
};

module.exports = defaultValues;
