import { Router } from 'express';
import { getTodaysAppointments } from '../controllers/clinical.controller';

const router = Router();

router.get('/today', getTodaysAppointments);
// Add other clinical routes here

export default router;
