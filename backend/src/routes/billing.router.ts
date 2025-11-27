import { Router } from 'express';
import { createTransaction } from '../controllers/billing.controller';

const router = Router();

router.post('/transactions', createTransaction);

export default router;
