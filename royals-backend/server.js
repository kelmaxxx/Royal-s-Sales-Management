import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { testConnection } from './src/config/database.js';
import { initPassport } from './src/config/passport.js';
import { initEmailService } from './src/utils/emailService.js';

import authRoutes from './src/routes/authRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import salesRoutes from './src/routes/salesRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import usersRoutes from './src/routes/usersRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
  skipSuccessfulRequests: true // Don't count successful logins
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// Increase payload limit for image uploads (base64 images can be large)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Passport for OAuth
app.use(passport.initialize());

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
// Apply stricter rate limit to auth routes
app.use('/api/auth', authLimiter, authRoutes);
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
    console.error('❌ Failed to connect to database. Please check your .env file.');
    process.exit(1);
  }

  // Initialize OAuth and email services
  initPassport();
  await initEmailService();

  app.listen(PORT, () => {
    console.log('');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log('🌐 Frontend should run on http://localhost:5173');
    console.log('');
  });
};

startServer();
