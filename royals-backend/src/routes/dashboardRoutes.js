import express from 'express';
import {
  getOverview,
  getRecentSales,
  getTopProducts,
  getLowStock
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/overview', getOverview);
router.get('/recent-sales', getRecentSales);
router.get('/top-products', getTopProducts);
router.get('/low-stock', getLowStock);

export default router;
