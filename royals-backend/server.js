import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './src/config/database.js';

import authRoutes from './src/routes/authRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import salesRoutes from './src/routes/salesRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import usersRoutes from './src/routes/usersRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// Increase payload limit for image uploads (base64 images can be large)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Royals Sales Management API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('? Failed to connect to database. Please check your .env file.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('');
    console.log(`?? Server running on http://localhost:${PORT}`);
    console.log(`?? API available at http://localhost:${PORT}/api`);
    console.log('?? Frontend should run on http://localhost:5173');
    console.log('');
  });
};

startServer();
