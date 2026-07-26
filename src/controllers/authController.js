import Session from '../models/session.js';
import User from '../models/user.js';
import createHttpError from 'http-errors';
import { setSessionCookies } from '../services/auth.js';
import { createSession } from '../services/auth.js';

const createUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw createHttpError(400, 'Email is required');
  }
  if (!password) {
    throw createHttpError(400, 'Password is required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'User already exists');
  }

  const newUser = await User.create({ email, password });
  res.status(201).json(newUser);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw createHttpError(400, 'Email is required');
  }
  if (!password) {
    throw createHttpError(400, 'Password is required');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid password');
  }

  const newSession = await createSession(user._id); // Create a session for the user
  setSessionCookies(res, newSession); // Set the session cookies in the response
  res.status(200).json({ user });
};
const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(204).send(); // Send a 204 No Content response
};
// const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email) {
//     throw createHttpError(400, 'Email is required');
//   }
//   if (!newPassword) {
//     throw createHttpError(400, 'New password is required');
//   }
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }
//   user.password = newPassword;
//   await user.save();
//   res.status(200).json({ message: 'Password reset successful' });
// };

// const resetEmail = async (req, res) => {
//   const { email, newEmail, password } = req.body;

//   if (!email) {
//     throw createHttpError(400, 'Email is required');
//   }
//   if (!newEmail) {
//     throw createHttpError(400, 'New email is required');
//   }
//   if (!password) {
//     throw createHttpError(400, 'Password is required');
//   }
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }
//   const isPasswordValid = await user.comparePassword(password);
//   if (!isPasswordValid) {
//     throw createHttpError(401, 'Invalid password');
//   }
//   user.email = newEmail;
//   await user.save();
//   res.status(200).json({ message: 'Email reset successful' });
// };

const refreshSession = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await Session.findOne({ refreshToken, sessionId });
  if (!session) {
    throw createHttpError(404, 'Session not found');
  }
  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();
  if (isSessionTokenExpired) {
    await session.deleteOne();
    throw createHttpError(401, 'Session token expired');
  }
  setSessionCookies(res, session);
  await res.status(200).json(session);
};

export {
  createSession,
  createUser,
  loginUser,
  logoutUser,
  // resetPassword,
  // resetEmail,
  refreshSession
};
