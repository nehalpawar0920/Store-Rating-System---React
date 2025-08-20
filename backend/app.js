
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js'; 
import ratingRoutes from './routes/ratingRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/', (req, res) => res.send('API running'));

export default app;
