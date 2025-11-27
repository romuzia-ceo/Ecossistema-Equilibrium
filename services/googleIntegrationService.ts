
import { MOCK_TODAYS_APPOINTMENTS } from '../constants';

// ===================================================================================
// SERVIÇO DE INTEGRAÇÃO GOOGLE (SIMULAÇÃO)
// ===================================================================================

export const checkGoogleCalendarStatus = async (): Promise<boolean> => {
    // Simula verificação de token armazenado
    const token = localStorage.getItem('google_calendar_token');
    return !!token;
};

export const getLastSyncTime = (): string | null => {
    return localStorage.getItem('google_calendar_last_sync');
};

export const connectGoogleCalendar = async (clientId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        console.log(`Iniciando fluxo OAuth simulado com ClientID: ${clientId}`);
        
        // Simula o delay da janela de popup do Google
        setTimeout(() => {
            localStorage.setItem('google_calendar_token', 'mock-token-xyz-123');
            resolve(true);
        }, 2000);
    });
};

export const disconnectGoogleCalendar = async (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.removeItem('google_calendar_token');
            localStorage.removeItem('google_calendar_last_sync');
            resolve();
        }, 500);
    });
};

export const syncAppointmentsToGoogle = async (): Promise<number> => {
    return new Promise((resolve) => {
        // Simula o tempo de envio de dados para a API do Google Calendar
        setTimeout(() => {
            // Retorna número de eventos sincronizados (simulado com total de hoje)
            const count = MOCK_TODAYS_APPOINTMENTS.length; 
            const now = new Date().toLocaleString('pt-BR');
            localStorage.setItem('google_calendar_last_sync', now);
            resolve(count); 
        }, 1500);
    });
};
