import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

const updateUserAvatar = async (req, res) => {
  const user = req.user;
  const avatar = req.file;
  let result;

  if (!user) {
    throw createHttpError(401, 'User not authenticated');
  }

  if (!avatar) {
    throw createHttpError(400, 'No file');
  }

  try {
    result = await saveFileToCloudinary(avatar.buffer, user._id);
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw createHttpError(500, 'Error uploading file');
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { avatar: result.secure_url },
    { returnDocument: 'after' }
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({ url: updatedUser.avatar });
};

export { updateUserAvatar };
