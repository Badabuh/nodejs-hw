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

NoteSchema.index({ tag: 1 });

export default mongoose.model('Note', NoteSchema);
