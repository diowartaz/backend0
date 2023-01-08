const joi = require("joi");

function newUserValidation(body) {
  const newUserValidationSchema = joi.object({
    email: joi.string().email().trim().required(),
    username: joi.string().min(3).max(15).trim().required(),
    password: joi.string().min(8).max(30).trim().required(),
  });
  return newUserValidationSchema.validate(body);
}

function connexionValidation(body) {
  const connexionSchema = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().min(2).max(20).trim().required(),
  });
  return connexionSchema.validate(body);
}

module.exports = { newUserValidation, connexionValidation };
