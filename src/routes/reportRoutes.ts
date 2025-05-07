import express from 'express';
import { getDailyRevenue, getSalesByCategory } from '../controllers/reportController';

const router = express.Router();

router.get('/revenue/daily', getDailyRevenue);
router.get('/sales/category', getSalesByCategory);

export default router;
