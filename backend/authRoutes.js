import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { signupValidator, loginValidator } from '../validators/userValidator.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.put('/update-password', authenticate, updatePassword);

export default router;