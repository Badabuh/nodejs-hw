import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';
const { Schema } = mongoose;

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    content: {
      type: String,
      trim: true,
      default: ''
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, tag: 1 });
NoteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', NoteSchema);
