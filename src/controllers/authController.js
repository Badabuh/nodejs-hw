import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import { setSessionCookies } from '../services/auth.js';
import { createSession } from '../services/auth.js';
import bcrypt from 'bcrypt';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

const clearSessionCookies = (res) => {
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw createHttpError(400, 'Email is required');
  }
  if (!password) {
    throw createHttpError(400, 'Password is required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });
  const newSession = await createSession(newUser._id); // Create a session for the user
  setSessionCookies(res, newSession); // Set the session cookies in the response

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
    throw createHttpError(401, 'User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid password');
  }

  await Session.deleteOne({ userId: user._id }); // Delete any existing session for the user
  const newSession = await createSession(user._id); // Create a session for the user
  setSessionCookies(res, newSession); // Set the session cookies in the response
  res.status(200).json(user);
};
const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  clearSessionCookies(res);
  res.status(204).send(); // Send a 204 No Content response
};
const refreshUserSession = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    clearSessionCookies(res);
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();
  if (isSessionTokenExpired) {
    await Session.deleteOne({ _id: session._id });
    clearSessionCookies(res);
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: session._id });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ message: 'Session refreshed' });
};

const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'Password reset email sent successfully' });
  }
  const resetToken = jwt.sign({ sub: { userId: user._id, email } }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  const templateSource = await fs.readFile('src/templates/reset-password-email.html', 'utf8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset',
      html: html
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
  res.status(200).json({ message: 'Password reset email sent successfully' });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, userId } = decoded.sub;
    const user = await User.findOne({ _id: userId, email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await Session.deleteMany({ userId });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }
};

export {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword
};
