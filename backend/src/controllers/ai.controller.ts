
import { Request, Response } from 'express';
import { 
    getFinancialInsights, 
    getMarketingPlan, 
    getSocialMediaPostsForCampaign,
    getDiagnosticAssistance,
    getAgendaResponse as getAgendaResponseFromService,
} from '../services/gemini.service';

export const getFinanceCopilotResponse = async (req: Request, res: Response) => {
    const { data, category, dateRange } = req.body;
    if (!data || !category || !dateRange) {
        return res.status(400).json({ message: 'Missing data, category, or dateRange.' });
    }
    try {
        const insight = await getFinancialInsights(data, category, dateRange);
        res.status(200).json({ insight });
    } catch (error) {
        res.status(500).json({ message: 'Error getting AI financial insights.' });
    }
};

export const getMarketingCopilotResponse = async (req: Request, res: Response) => {
    const { metrics } = req.body;
    if (!metrics) {
        return res.status(400).json({ message: 'Missing metrics data.' });
    }
    try {
        const plan = await getMarketingPlan(metrics);
        res.status(200).json({ plan });
    } catch (error) {
        res.status(500).json({ message: 'Error getting AI marketing plan.' });
    }
};

export const getSocialMediaCopilotResponse = async (req: Request, res: Response) => {
    const { campaignName } = req.body;
    if (!campaignName) {
        return res.status(400).json({ message: 'Missing campaign name.' });
    }
    try {
        const posts = await getSocialMediaPostsForCampaign(campaignName);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Error getting AI social media posts.' });
    }
};

export const getClinicalCopilotResponse = async (req: Request, res: Response) => {
    const { clinicalNotes } = req.body;
    if (!clinicalNotes) {
        return res.status(400).json({ message: 'Missing clinical notes.' });
    }
    try {
        const analysis = await getDiagnosticAssistance(clinicalNotes);
        res.status(200).json({ analysis });
    } catch (error) {
        res.status(500).json({ message: 'Error getting AI diagnostic assistance.' });
    }
};

export const getAgendaResponse = async (req: Request, res: Response) => {
    const { userInput, conversationId, patientName } = req.body;
    if(!userInput || !conversationId || !patientName) {
        return res.status(400).json({ message: 'Missing userInput, conversationId, or patientName.' });
    }
    try {
        const response = await getAgendaResponseFromService(userInput, conversationId, patientName);
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({ message: 'Error getting AI agenda response.' });
    }
};