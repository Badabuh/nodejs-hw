import mongoose from 'mongoose';
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
      enum: [
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo'
      ],
      default: 'Todo'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Note', NoteSchema);
