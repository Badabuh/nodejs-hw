import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createUserSchema,
  loginUserSchema,
  // resetPasswordSchema,
  // resetEmailSchema,
  getSessionSchema
} from '../validations/authValidate.js';
import {
  createUser,
  loginUser,
  // resetPassword,
  // resetEmail,
  logoutUser,
  refreshSession
} from '../controllers/authControllers.js';

const router = Router();

router.post('/users/register', celebrate(createUserSchema), createUser);
router.post('/users/login', celebrate(loginUserSchema), loginUser);
// router.post('/users/reset-password', celebrate(resetPasswordSchema), resetPassword);
// router.post('/users/reset-email', celebrate(resetEmailSchema), resetEmail);
router.post('/users/logout', celebrate(getSessionSchema), logoutUser);
router.get('/auth/session', celebrate(getSessionSchema), refreshSession);

export default router;
