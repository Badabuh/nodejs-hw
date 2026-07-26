import mongoose from 'mongoose';
const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    accessTokenValidUntil: {
      type: Date,
      required: true
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);
export default mongoose.model('Session', SessionSchema);
