import { TAGS } from '../constants/tags.js';
import { Joi, Segments } from 'celebrate';

const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional()
  })
};

const NoteByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().hex().length(24).required()
  })
};

const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    tag: Joi.string()
      .valid(...TAGS)
      .required()
  })
};

const updateNoteSchema = {
  ...NoteByIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional()
  }).min(1)
};

export { getAllNotesSchema, NoteByIdSchema, createNoteSchema, updateNoteSchema };
