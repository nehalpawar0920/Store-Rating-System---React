import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import { getAllUsers } from '../controllers/adminController.js'; 
import { getAllStores } from '../controllers/adminController.js';
import { getUserDetails } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorizeRoles('admin'), getDashboardStats);
router.get('/users', authenticate, authorizeRoles('admin'), getAllUsers);
router.get('/stores', authenticate, authorizeRoles('admin'), getAllStores);
router.get('/users/:id', authenticate, authorizeRoles('admin'), getUserDetails);

export default router;