import { Router } from 'express';
import { 
    getFinanceCopilotResponse,
    getMarketingCopilotResponse,
    getSocialMediaCopilotResponse,
    getClinicalCopilotResponse,
    getAgendaResponse
} from '../controllers/ai.controller';

const router = Router();

router.post('/finance-copilot', getFinanceCopilotResponse);
router.post('/marketing-plan', getMarketingCopilotResponse);
router.post('/social-media-plan', getSocialMediaCopilotResponse);
router.post('/clinical-copilot', getClinicalCopilotResponse);
router.post('/agenda-chat', getAgendaResponse);

export default router;
