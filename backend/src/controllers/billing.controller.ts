

import { Request, Response } from 'express';
import db from '../database';

export const createTransaction = async (req: Request, res: Response) => {
    const { appointmentId, patientId, serviceId, amount, paymentMethod } = req.body;
    
    if (!appointmentId || !patientId || !serviceId || !amount || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required fields for transaction.' });
    }
    
    try {
        const newTransaction = await db.createTransaction({
            appointmentId,
            patientId,
            serviceId,
            amount,
            paymentMethod
        });
        res.status(201).json(newTransaction);

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
