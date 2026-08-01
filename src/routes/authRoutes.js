import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestPasswordResetSchema,
  resetPasswordSchema
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);
router.post(
  '/auth/request-password-reset',
  celebrate(requestPasswordResetSchema),
  requestPasswordReset
);
router.post('/auth/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
