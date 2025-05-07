import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  validateRequest,
  login
);

router.get('/me', getCurrentUser);

export default router;
