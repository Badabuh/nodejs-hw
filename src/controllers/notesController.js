import Note from '../models/note.js';
import createHttpError from 'http-errors';

const getAllNotes = async (req, res) => {
  const result = await Note.find();
  res.status(200).json(result);
};

const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  if (!noteId) {
    return res.status(404).json(createHttpError(404, 'Note ID is required'));
  }
  const note = await Note.findById(noteId);
  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const newNote = await Note.create({ title, content });
  res.status(201).json(newNote);
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  if (!noteId) {
    return res.status(404).json(createHttpError(404, 'Note ID is required'));
  }
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { returnDocument: 'after' }
  );
  res.status(200).json(updatedNote);
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  if (!noteId) {
    return res.status(404).json(createHttpError(404, 'Note ID is required'));
  }
  const deletedNote = await Note.findByIdAndDelete(noteId);
  res.status(200).json(deletedNote);
};

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
