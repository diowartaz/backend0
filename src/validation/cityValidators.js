const joi = require("joi");

function findItemValidation(params) {
  const findItemSchema = joi.object({
    nb: joi.number().positive(),
  });
  return findItemSchema.validate(params);
}

function idValidation(params) {
  const idSchema = joi.object({
    id: joi.number().positive(),
  });
  return idSchema.validate(params);
}

module.exports = { findItemValidation, idValidation };
