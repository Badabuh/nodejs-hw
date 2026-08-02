import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
const getAllNotes = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, perPage = 10, search = '', tag } = req.query;

  const pipeline = [];

  if (search) {
    pipeline.push({
      $match: {
        $text: { $search: search },
        userId
      }
    });
  }
  if (userId) {
    pipeline.push({
      $match: {
        userId
      }
    });
  }

  if (tag) {
    pipeline.push({
      $match: {
        tag,
        userId
      }
    });
  }

  const result = await Note.aggregate(pipeline).facet({
    notes: [{ $sort: { createdAt: -1 } }, { $skip: (page - 1) * perPage }, { $limit: perPage }],
    totalNotes: [{ $count: 'count' }]
  });

  const notes = result[0].notes;
  const totalNotes = result[0].totalNotes[0] ? result[0].totalNotes[0].count : 0;

  res.status(200).json({
    notes,
    page,
    perPage,
    totalNotes,
    totalPages: Math.ceil(totalNotes / perPage)
  });
};

const getNoteById = async (req, res) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const userId = req.user._id;
  const { title, content, tag } = req.body;
  const newNote = await Note.create({ title, content, tag, userId });
  res.status(201).json(newNote);
};

const updateNote = async (req, res) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const { title, content, tag } = req.body;
  const updatePayload = {};

  if (title) {
    updatePayload.title = title;
  }
  if (content !== undefined) {
    updatePayload.content = content;
  }
  if (tag !== undefined) {
    updatePayload.tag = tag;
  }

  const updatedNote = await Note.findOneAndUpdate({ _id: noteId, userId }, updatePayload, {
    returnDocument: 'after'
  });
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
