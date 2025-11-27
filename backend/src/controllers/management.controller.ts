

import { Request, Response } from 'express';
import db from '../database';

// Professionals
export const getProfessionals = async (req: Request, res: Response) => {
    try {
        const result = await db.getProfessionals();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching professionals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Services
export const getServices = async (req: Request, res: Response) => {
    try {
        const result = await db.getServices();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Insurance Plans
export const getInsurancePlans = async (req: Request, res: Response) => {
    try {
        const plans = await db.getInsurancePlans();
        res.status(200).json(plans);
    } catch (error) {
        console.error('Error fetching insurance plans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Templates
export const getTemplates = async (req: Request, res: Response) => {
    try {
        const result = await db.getTemplates();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await db.getUsers();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
