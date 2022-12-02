const items = ["wood", "metal", "stone", "srew"];

const newCity = {
  day: 1,
  buildings: [],
  nb_zb_history: [],
  nb_zb_previous_attack: 9,
  nb_zb_next_attack_min: 13,
  nb_zb_next_attack_max: 17,
  time: 5 * 60 * 60, //6h du mat
  inventory: {},
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
