import { Router } from 'express';
import {
    getProfessionals,
    getServices,
    getInsurancePlans,
    getTemplates,
    getUsers
} from '../controllers/management.controller';

const router = Router();

router.get('/professionals', getProfessionals);
router.get('/services', getServices);
router.get('/insurance-plans', getInsurancePlans);
router.get('/templates', getTemplates);
router.get('/users', getUsers);

export default router;
