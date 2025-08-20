import express from 'express';
import { getOwnerDashboard } from '../controllers/ownerController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorizeRoles('owner'), getOwnerDashboard);

export default router;
