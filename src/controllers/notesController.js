import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
const getAllNotes = async (req, res) => {
  const userId = req.user._id; // Assuming the user is authenticated and their ID is available in req.user
  const { page = 1, perPage = 10, search = '', tag } = req.query;

  const notesQuery = await Note.find({ userId });
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    });
  }
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.countDocuments(),
    notesQuery.skip((page - 1) * perPage).limit(perPage)
  ]);

  res.status(200).json({
    notes,
    page,
    perPage,
    totalNotes,
    totalPages: Math.ceil(totalNotes / perPage)
  });
};

const getNoteById = async (req, res) => {
  const userId = req.user._id; // Assuming the user is authenticated and their ID is available in req.user
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const userId = req.user._id; // Assuming the user is authenticated and their ID is available in req.user
  const { title, content, tag } = req.body;
  const newNote = await Note.create({ title, content, tag, userId });
  res.status(201).json(newNote);
};

const updateNote = async (req, res) => {
  const userId = req.user._id; // Assuming the user is authenticated and their ID is available in req.user
  const { noteId } = req.params;
  const { title, content, tag } = req.body;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { title, content, tag },
    { returnDocument: 'after' }
  );
  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(updatedNote);
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(deletedNote);
};

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
