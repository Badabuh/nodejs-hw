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
    }
  },
  { timestamps: true }
);

NoteSchema.index({ tag: 1, createdAt: -1 });
NoteSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Note', NoteSchema);
