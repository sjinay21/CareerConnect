import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(1),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  currentPassword: Joi.string(),
  about: Joi.string().allow("", null),
  summary: Joi.string().allow("", null),
  location: Joi.string().allow("", null),
  skills: Joi.string().allow("", null),
});

export { registerSchema, loginSchema, updateUserSchema };
