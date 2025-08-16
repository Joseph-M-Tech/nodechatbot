const Joi = require('joi');
const { AppError } = require('./errorHandler');

const userRegistrationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const appointmentSchema = Joi.object({
  dateTime: Joi.date().greater('now').required(),
  reason: Joi.string().min(10).max(500).required()
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};

module.exports = {
  validateUserRegistration: validate(userRegistrationSchema),
  validateUserLogin: validate(userLoginSchema),
  validateAppointment: validate(appointmentSchema)
};