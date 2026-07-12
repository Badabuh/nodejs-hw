import Note from '../models/note.js';

const getAllNotes = async (req, res) => {
  const result = await Note.find();
  res.status(200).json(result);
};

const getNoteById = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const newNote = await Note.create({ title, content });
  res.status(201).json(newNote);
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
  res.status(200).json(updatedNote);
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.status(200).json({ message: `Note with ID: ${id} deleted` });
};

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
