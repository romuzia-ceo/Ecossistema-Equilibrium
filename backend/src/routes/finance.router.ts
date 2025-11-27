import { Router } from 'express';
import { getDashboardData } from '../controllers/finance.controller';

const router = Router();

router.get('/dashboard', getDashboardData);

export default router;
