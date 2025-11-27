import express, { Express } from 'express';
import cors from 'cors';
// import dotenv from 'dotenv'; // Removido para compatibilidade com o ambiente de browser-sandbox

// Import all routers
import managementRouter from './routes/management.router';
import clinicalRouter from './routes/clinical.router';
import billingRouter from './routes/billing.router';
import financeRouter from './routes/finance.router';
import aiRouter from './routes/ai.router';
import healthRouter from './routes/health.router';

export function createServer(): Express {
    // dotenv.config(); // Removido
    const app: Express = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // API Routes
    app.use('/api/health', healthRouter);
    app.use('/api/management', managementRouter);
    app.use('/api/clinical', clinicalRouter);
    app.use('/api/billing', billingRouter);
    app.use('/api/finance', financeRouter);
    app.use('/api/ai', aiRouter);
    
    return app;
}