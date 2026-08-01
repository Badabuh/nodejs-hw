import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
const updateUserAvatar = async (req, res) => {
  const user = req.user;
  const avatar = req.file;
  if (!user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if (!avatar) {
    throw createHttpError(400, 'No file');
  }
  saveFileToCloudinary(avatar.buffer, user._id)
    .then((result) => {
      user.avatar = result.secure_url;
      return user.save().then(() => {
        res.status(200).json({ url: user.avatar });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload avatar' });
    });
};

export { updateUserAvatar };
