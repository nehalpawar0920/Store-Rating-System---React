import { body } from 'express-validator';

export const ratingValidator = [
  body('storeId').isInt().withMessage('Store ID must be an integer'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

export const storeValidator = [
  body('name')
    .isLength({ min: 5, max: 60 })
    .withMessage('Store name must be 5-60 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Max address length is 400 characters'),
  body('ownerId').isInt().withMessage('Owner ID must be an integer'),
];
