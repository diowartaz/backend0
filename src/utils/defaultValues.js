const items = ["wood", "metal", "stone", "screw", "patch"];

const palissade = {
  id: 1,
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
  name: "Huge pit",
  defense: 15,
  lvl: 0,
  lvl_max: 4,
  time: 8 * 60 * 60,
  inventory: {},
};

const giantWall = {
  id: 3,
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

const buildings = [palissade, hugePit, giantWall, renforcedWall, barricade];
const skills = [digger, fast_leaner, builder];

const day_start_time = 8 * 60 * 60;
const day_end_time = 24 * 60 * 60 + 59;

const newCity = {
  day: 1,
  defense: 20,
  buildings: buildings,
  skills: skills,
  nb_zb_history: [],
  nb_zb_previous_attack: 9,
  nb_zb_next_attack_min: 13,
  nb_zb_next_attack_max: 17,
  time: day_start_time,
  inventory: { wood: 0, stone: 0, screw: 0, metal: 0, patch: 0 },
  speeds: {
    build: 1,
    learn: 1,
    dig: 1,
    meditate: 1,
  },
  last_timestamp_request: null,
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
};

module.exports = defaultValues;
