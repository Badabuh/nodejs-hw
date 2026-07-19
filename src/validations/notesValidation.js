import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const validateNoteSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(3).max(10),
    search: Joi.string().trim().allow(''),
    tag: Joi.string().valid(...TAGS)
  })
};

const validateNoteIdParam = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
  })
};
const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().required(),
    content: Joi.string().trim().default(''),
    tag: Joi.string().valid(...TAGS)
  })
};

const updateNoteSchema = {
  ...validateNoteIdParam,
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim(),
    content: Joi.string().trim(),
    tag: Joi.string().valid(...TAGS)
  }).min(1)
};

export { createNoteSchema, updateNoteSchema, validateNoteIdParam, validateNoteSchema };
