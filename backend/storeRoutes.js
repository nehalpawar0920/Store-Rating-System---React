import express from 'express';
import { createStore, getAllStores } from '../controllers/storeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { storeValidator } from '../validators/generalValidator.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('owner'), storeValidator, createStore);
router.get('/', authenticate, getAllStores);

export default router;
