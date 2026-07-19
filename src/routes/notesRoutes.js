import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notesController.js';
import {
  createNoteSchema,
  updateNoteSchema,
  validateNoteIdParam,
  validateNoteSchema
} from '../validations/notesValidation.js';
import { celebrate } from 'celebrate';
const router = Router();

router.get('/notes', celebrate(validateNoteSchema), getAllNotes);

router.get('/notes/:noteId', celebrate(validateNoteIdParam), getNoteById);

router.post('/notes', celebrate(createNoteSchema), createNote);
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

router.delete('/notes/:noteId', celebrate(validateNoteIdParam), deleteNote);

export default router;
