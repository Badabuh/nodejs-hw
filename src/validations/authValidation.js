import { Joi, Segments } from 'celebrate';

const createUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
};

const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
};

// const resetPasswordSchema = {
//   [Segments.COOKIES]: Joi.object({
//     token: Joi.string().required()
//   }).unknown(true),
//   [Segments.BODY]: Joi.object({
//     email: Joi.string().email().required(),
//     newPassword: Joi.string().min(8).required()
//   })
// };
// const resetEmailSchema = {
//   [Segments.COOKIES]: Joi.object({
//     token: Joi.string().required()
//   }).unknown(true),
//   [Segments.BODY]: Joi.object({
//     email: Joi.string().email().required(),
//     newEmail: Joi.string().email().required(),
//     password: Joi.string().min(8).required()
//   })
// };
const getSessionSchema = {
  [Segments.COOKIES]: Joi.object({
    sessionId: Joi.string().hex().length(24).required(),
    accessToken: Joi.string(),
    refreshToken: Joi.string()
  }).unknown(true)
};
export {
  createUserSchema,
  loginUserSchema,
  // resetPasswordSchema,
  // resetEmailSchema,
  getSessionSchema
};
