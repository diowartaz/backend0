const joi = require("joi");

function findItemValidation(params) {
  const findItemSchema = joi.object({
    nb: joi.number().positive(),
  });
  return findItemSchema.validate(params);
}

function buildValidation(params) {
  const buildSchema = joi.object({
    id: joi.number().positive(),
  });
  return buildSchema.validate(params);
}

module.exports = { findItemValidation, buildValidation };
