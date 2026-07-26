import Note from '../models/note.js';
import createHttpError from 'http-errors';
const getAllNotes = async (req, res) => {
  const userId = req.user._id; // Assuming the user is authenticated and their ID is available in req.user
  const { page = 1, perPage = 10, search = '', tag } = req.query;

  const pipeline = [];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { $text: { $search: search, $caseSensitive: false } },
          { $text: { $search: search, $caseSensitive: false } }
        ]
      }
    });
  }

  if (tag) {
    pipeline.push({
      $match: {
        tag
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

  pipeline.push({
    $sort: { createdAt: -1 }
  });

  const [result] = await Note.aggregate([
    ...pipeline,
    {
      $facet: {
        notes: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const notes = result.notes;
  const totalCount = result.totalCount[0] ? result.totalCount[0].count : 0;

  res.status(200).json({
    notes,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / perPage)
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
    { title, content, tag, userId },
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
