
// This file will now act as a data access layer,
// which can be swapped between a real DB and a mock implementation.
import * as mockData from '../../constants';
import { Professional, ClinicService, HealthInsurancePlan, Template, User, ClinicalAppointment, Transaction, PaymentMethod, FullTransaction, Patient, CostCenterCategory } from '../../types';

// ==========================================================
// MOCK DATABASE IMPLEMENTATION FOR IN-BROWSER TESTING
// ==========================================================
// This simulates the database by returning the constant mock data.
// It allows the BackendTestView to function without a real DB connection.

let FULL_TRANSACTIONS: FullTransaction[] = [];

const generateHistoricalTransactions = () => {
    // Safety check: ensure mock data is loaded correctly
    if (!mockData || !mockData.MOCK_PROFESSIONALS || !mockData.MOCK_SERVICES) {
        console.error("[db] Mock data missing in database.ts");
        return;
    }

    const transactions: FullTransaction[] = [];
    const today = new Date('2025-11-20T12:00:00Z');
    
    // Reduced from 365 to 60 days to prevent large JSON payloads causing stream errors in sandbox
    const DAYS_TO_SIMULATE = 60; 
    
    for (let i = 0; i < DAYS_TO_SIMULATE; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Simulate 2 to 4 transactions per day
        const numTransactions = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < numTransactions; j++) {
            const professional = mockData.MOCK_PROFESSIONALS[Math.floor(Math.random() * mockData.MOCK_PROFESSIONALS.length)];
            const service = mockData.MOCK_SERVICES[Math.floor(Math.random() * mockData.MOCK_SERVICES.length)];
            const patient = mockData.MOCK_PATIENTS[Math.floor(Math.random() * mockData.MOCK_PATIENTS.length)];

            // Simulate some insured patients
            const useInsurance = patient.insurancePlanId && Math.random() > 0.5;
            const plan = useInsurance ? mockData.MOCK_INSURANCE_PLANS.find(p => p.id === patient.insurancePlanId) : null;
            
            let amount = service.price;
            if (plan && plan.priceTable[service.id]) {
                amount = plan.priceTable[service.id];
            }

            const transaction: FullTransaction = {
                id: `txn-${date.getTime()}-${j}`,
                appointmentId: `app-hist-${date.getTime()}-${j}`,
                patientId: patient.id,
                serviceId: service.id,
                amount: amount * (0.9 + Math.random() * 0.2), // slight variation
                paymentMethod: Math.random() > 0.5 ? PaymentMethod.CARD : PaymentMethod.CASH,
                date: date.toISOString(),
                professionalName: professional.name,
                professionalRole: professional.role.includes('Neuro') ? 'Neuropsicologia' : 'Psicologia',
                serviceName: service.name,
            };
            transactions.push(transaction);
        }
    }
    FULL_TRANSACTIONS = transactions;
    console.log(`[db]: Generated ${FULL_TRANSACTIONS.length} historical transactions.`);
};

const ensureTransactions = () => {
    if (FULL_TRANSACTIONS.length === 0) {
        generateHistoricalTransactions();
    }
};


const db = {
    getProfessionals: async (): Promise<Professional[]> => Promise.resolve(mockData.MOCK_PROFESSIONALS),
    getServices: async (): Promise<ClinicService[]> => Promise.resolve(mockData.MOCK_SERVICES),
    getInsurancePlans: async (): Promise<HealthInsurancePlan[]> => Promise.resolve(mockData.MOCK_INSURANCE_PLANS),
    getTemplates: async (): Promise<Template[]> => Promise.resolve(mockData.MOCK_TEMPLATES),
    getUsers: async (): Promise<User[]> => Promise.resolve(mockData.MOCK_USERS),
    getTodaysAppointments: async (): Promise<ClinicalAppointment[]> => Promise.resolve(mockData.MOCK_TODAYS_APPOINTMENTS),
    
    createTransaction: async (txn: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
        // This is a simplified create for the live billing modal. It won't have the full details.
        ensureTransactions();
        const appointment = mockData.MOCK_TODAYS_APPOINTMENTS.find(a => a.id === txn.appointmentId);
        
        const newTxn: FullTransaction = {
            ...txn,
            id: `txn-${Date.now()}`,
            date: new Date().toISOString(),
            professionalName: appointment?.professional.name || 'N/A',
            professionalRole: appointment?.professional.role.includes('Neuro') ? 'Neuropsicologia' : 'Psicologia',
            serviceName: appointment?.service.name || 'N/A',
        };
        FULL_TRANSACTIONS.unshift(newTxn);
        return Promise.resolve(newTxn);
    },
    getTransactions: async (): Promise<FullTransaction[]> => {
        ensureTransactions();
        return Promise.resolve(FULL_TRANSACTIONS);
    },
};

export default db;

// ==========================================================
// ORIGINAL REAL DATABASE IMPLEMENTATION (For VPS Deployment)
// ==========================================================
/*
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const testConnection = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('[db]: Database connection successful.');
    } catch (err) {
        console.error('[db]: Database connection failed.', err);
    }
};

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
*/
