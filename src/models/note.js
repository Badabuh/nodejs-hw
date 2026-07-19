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
      enum: TAGS
    }
  },
  { timestamps: true }
);

NoteSchema.index({ createdAt: -1, title: 1 });

export default mongoose.model('Note', NoteSchema);
