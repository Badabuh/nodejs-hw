import { Joi, Segments } from 'celebrate';

const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
};

const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required()
  })
};

const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required(),
    Password: Joi.string().min(8).required()
  })
};
export { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema };
