
import { Transaction, PaymentMethod } from '../types';

// ===================================================================================
// SERVIÇO DE FATURAMENTO (SIMULAÇÃO DE FRONTEND)
// ===================================================================================
// Este serviço lida com a criação de transações, enviando-as para o backend.

export const createTransaction = async (
    appointmentId: string,
    patientId: string,
    serviceId: string,
    amount: number,
    paymentMethod: PaymentMethod
): Promise<Transaction> => {
    
    const response = await fetch('/api/billing/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appointmentId,
            patientId,
            serviceId,
            amount,
            paymentMethod,
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create transaction on backend");
    }

    const newTransaction = await response.json();
    return newTransaction;
};