import { MOCK_PATIENTS } from '../constants';
import { Patient, ClinicalAppointment, GeneratedDocument } from '../types';
import { getAppointmentsByPatientId } from './clinicalService';
import { getDocumentsByPatientId } from './documentService';

// ===================================================================================
// SERVIÇO DO PORTAL DO PACIENTE (AGREGADOR)
// ===================================================================================

export interface PatientPortalData {
    profile: Patient | null;
    appointments: ClinicalAppointment[];
    documents: GeneratedDocument[];
}

export const getPatientPortalData = async (patientId: string): Promise<PatientPortalData> => {
    // Em um app real, estas seriam chamadas de API concorrentes (Promise.all)
    const profile = MOCK_PATIENTS.find(p => p.id === patientId) || null;
    const appointments = await getAppointmentsByPatientId(patientId);
    const documents = await getDocumentsByPatientId(patientId);

    return new Promise(resolve => setTimeout(() => resolve({
        profile,
        appointments,
        documents,
    }), 500));
};
