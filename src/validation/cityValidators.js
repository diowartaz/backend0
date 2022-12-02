const joi = require("joi");

function findItemValidation(params) {
  const findItemSchema = joi.object({
    nb: joi.number().positive(),
  });
  return findItemSchema.validate(params);
}

module.exports = { findItemValidation };
