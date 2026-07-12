import Note from '../models/note.js';
import createHttpError from 'http-errors';

const getAllNotes = async (req, res) => {
  const result = await Note.find();
  res.status(200).json(result);
};

const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const newNote = await Note.create({ title, content });
  res.status(201).json(newNote);
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { returnDocument: 'after' }
  );
  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(updatedNote);
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findByIdAndDelete(noteId);
  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(deletedNote);
};

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
