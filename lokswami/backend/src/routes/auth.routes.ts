import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateProfile);

export default router;