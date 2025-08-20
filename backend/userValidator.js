import { body } from 'express-validator';

export const signupValidator = [
  body('name')
    .isLength({ min: 5, max: 60 })
    .withMessage('Name must be 5–60 characters long'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address max length is 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .withMessage('Password must have at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must include a special character'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
