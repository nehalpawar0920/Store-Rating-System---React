import express from 'express';
import { submitOrUpdateRating, getStoreRatings } from '../controllers/ratingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { ratingValidator } from '../validators/generalValidator.js';

const router = express.Router();

router.post('/', authenticate, ratingValidator, submitOrUpdateRating);
router.get('/store/:id', authenticate, authorizeRoles('admin', 'owner'), getStoreRatings);

export default router;
