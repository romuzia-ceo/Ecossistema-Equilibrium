import { MOCK_TODAYS_APPOINTMENTS } from '../constants';
// FIX: Import ClinicalAppointment to strongly type the function parameter.
import { MarketingMetrics, ClinicalAppointment } from '../types';
import { getTodaysAppointments } from './clinicalService';

// ===================================================================================
// SERVIÇO DE MARKETING (SIMULAÇÃO DE BACKEND)
// ===================================================================================

const processAppointmentData = (appointments: ClinicalAppointment[]): MarketingMetrics => {
    if (appointments.length === 0) {
        return {
            topProfessional: { name: 'N/A', count: 0 },
            topService: { name: 'N/A', count: 0 },
            satisfactionRate: 0,
            newPatients: 0,
            professionalPopularity: [],
        };
    }

    const professionalCounts = appointments.reduce((acc, app) => {
        const name = app.professional.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const serviceCounts = appointments.reduce((acc, app) => {
        const name = app.service.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topProfessionalEntry = Object.entries(professionalCounts).sort((a, b) => b[1] - a[1])[0];
    const topServiceEntry = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];

    const professionalPopularity = Object.entries(professionalCounts).map(([name, value]) => ({
        name,
        value,
    }));

    return {
        topProfessional: { name: topProfessionalEntry[0], count: topProfessionalEntry[1] },
        topService: { name: topServiceEntry[0], count: topServiceEntry[1] },
        // Mocked data for demonstration
        satisfactionRate: 92,
        newPatients: 15,
        professionalPopularity,
    };
};

export const getMarketingDashboardData = async (): Promise<MarketingMetrics> => {
    // In a real app, you'd fetch a larger dataset, not just today's appointments.
    // Here we use today's data for simulation purposes.
    const appointments = MOCK_TODAYS_APPOINTMENTS; // Using static mock for simplicity
    return new Promise(resolve => setTimeout(() => resolve(processAppointmentData(appointments)), 500));
};
