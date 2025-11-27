
import { MOCK_TODAYS_APPOINTMENTS, MOCK_PATIENT_HISTORY, MOCK_PROFESSIONALS, MOCK_SERVICES, MOCK_PATIENTS } from '../constants';
import { ClinicalAppointment, ConsultationRecord, ClinicalAppointmentStatus } from '../types';
import { getProfessionalAvailability, bookAppointment as reserveSlot } from './clinicService';

// ===================================================================================
// SERVIÇO CLÍNICO (SIMULAÇÃO DE BACKEND)
// ===================================================================================

let appointmentsData: ClinicalAppointment[] = JSON.parse(JSON.stringify(MOCK_TODAYS_APPOINTMENTS));
// Torna o histórico do paciente um estado mutável para permitir adições
let patientHistoryData: ConsultationRecord[] = JSON.parse(JSON.stringify(MOCK_PATIENT_HISTORY));

export const getTodaysAppointments = async (): Promise<ClinicalAppointment[]> => {
    return new Promise(resolve => setTimeout(() => resolve(appointmentsData), 300));
};

export const getAppointmentsByPatientId = async (patientId: string): Promise<ClinicalAppointment[]> => {
    // In a real app, this would query a larger dataset. Here, we filter today's mock data.
    // We also sort them to ensure latest are first or future are distinct in UI logic
    return new Promise(resolve => setTimeout(() => resolve(
        [...appointmentsData]
            .filter(app => app.patient.id === patientId)
    ), 300));
};

export const getPatientHistory = async (patientId: string): Promise<ConsultationRecord[]> => {
    // Em uma aplicação real, você consultaria o banco de dados pelo ID do paciente.
    console.log(`Buscando histórico para o paciente com ID: ${patientId}`);
    // Retorna os dados do estado, ordenados com os mais recentes primeiro
    return new Promise(resolve => setTimeout(() => resolve(
        [...patientHistoryData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ), 500));
};

// Salva um novo registro de consulta no histórico do paciente
export const saveConsultation = async (record: Omit<ConsultationRecord, 'id' | 'date'>): Promise<ConsultationRecord> => {
     return new Promise(resolve => {
        const newRecord: ConsultationRecord = {
            ...record,
            id: `hist-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
        };
        console.log("Salvando registro de consulta:", newRecord);
        patientHistoryData.push(newRecord);
        resolve(newRecord);
    });
};


export const updateAppointmentStatus = async (appointmentId: string, status: ClinicalAppointmentStatus): Promise<boolean> => {
     return new Promise(resolve => {
        // Garante que apenas um paciente esteja 'Em Atendimento'
        if (status === ClinicalAppointmentStatus.EM_ATENDIMENTO) {
            appointmentsData = appointmentsData.map(a => 
                a.status === ClinicalAppointmentStatus.EM_ATENDIMENTO 
                ? { ...a, status: ClinicalAppointmentStatus.AGUARDANDO } 
                : a
            );
        }

        const index = appointmentsData.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
            appointmentsData[index].status = status;
             console.log(`Status do agendamento ${appointmentId} atualizado para ${status}`);
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

export const createAppointment = async (
    patientId: string, 
    professionalId: string, 
    serviceId: string, 
    date: string, 
    time: string
): Promise<ClinicalAppointment> => {
    return new Promise(async (resolve, reject) => {
        const professional = MOCK_PROFESSIONALS.find(p => p.id === professionalId);
        const service = MOCK_SERVICES.find(s => s.id === serviceId);
        const patient = MOCK_PATIENTS.find(p => p.id === patientId);

        if (!professional || !service || !patient) {
            reject(new Error("Dados inválidos para agendamento."));
            return;
        }

        // 1. Sincronização: Reservar o slot na agenda do profissional via clinicService
        // Isso garante que o slot seja marcado como ocupado na lógica de Disponibilidade
        const slotReserved = await reserveSlot(professional.name, date, time, patient.name);
        
        if (!slotReserved) {
             reject(new Error("Este horário não está mais disponível."));
             return;
        }

        // 2. Criar objeto de agendamento
        const newAppointment: ClinicalAppointment = {
            id: `app-new-${Date.now()}`,
            time: time, 
            patient: patient,
            professional: professional,
            service: service,
            status: ClinicalAppointmentStatus.AGUARDANDO
        };

        // 3. Salvar no mock DB de agendamentos
        appointmentsData.push(newAppointment);
        
        setTimeout(() => resolve(newAppointment), 500);
    });
};
