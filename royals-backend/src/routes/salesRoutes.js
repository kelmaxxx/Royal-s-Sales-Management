import express from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  deleteSale,
  getSalesStats
} from '../controllers/salesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getSalesStats);
router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', createSale);
router.delete('/:id', deleteSale);

export default router;
