import { MOCK_PROFESSIONALS, MOCK_SERVICES } from '../constants';
import { Professional, ClinicService } from '../types';

// ===================================================================================
// SERVIÇO DE CLÍNICA (SIMULAÇÃO DE BACKEND)
// ===================================================================================
// Este serviço simula o banco de dados e a lógica de negócios da clínica.
// Em um sistema real, isso seria uma API REST/GraphQL conectada a um banco de dados real.
// Para a simulação, os dados são mutáveis para refletir agendamentos.
// ===================================================================================

let professionalsData: Professional[] = JSON.parse(JSON.stringify(MOCK_PROFESSIONALS)); // Deep copy for mutable state

export const getProfessionals = async (): Promise<Professional[]> => {
    // Simula uma chamada de API assíncrona
    return new Promise(resolve => setTimeout(() => resolve(professionalsData), 200));
};

export const getProfessionalAvailability = async (professionalName: string, date: string): Promise<string[]> => {
    return new Promise(resolve => {
        const professional = professionalsData.find(p => p.name.toLowerCase() === professionalName.toLowerCase());
        if (!professional) {
            resolve([]);
            return;
        }

        const dailyAvailability = professional.availability[date];
        if (!dailyAvailability) {
            resolve([]); // Professional doesn't work on this day
            return;
        }

        const bookedSlots = new Set(professional.schedule[date]?.map(slot => slot.time) || []);
        
        const availableSlots: string[] = [];
        const slotDuration = 60; // Assuming 60-minute slots
        
        const parseTime = (timeStr: string) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const dateObj = new Date();
            dateObj.setHours(hours, minutes, 0, 0);
            return dateObj;
        };
        
        let currentTime = parseTime(dailyAvailability.start);
        const endTime = parseTime(dailyAvailability.end);
        const breakStartTime = dailyAvailability.lunchBreak ? parseTime(dailyAvailability.lunchBreak.start) : null;
        const breakEndTime = dailyAvailability.lunchBreak ? parseTime(dailyAvailability.lunchBreak.end) : null;

        while (currentTime < endTime) {
            const timeString = currentTime.toTimeString().substring(0, 5);

            const isInBreak = breakStartTime && breakEndTime && currentTime >= breakStartTime && currentTime < breakEndTime;

            if (!bookedSlots.has(timeString) && !isInBreak) {
                availableSlots.push(timeString);
            }
            
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
        }
        
        resolve(availableSlots);
    });
};

export const getServicePrice = async (serviceName: string): Promise<{ price: string; instructions: string | null } | string | null> => {
     return new Promise(resolve => {
        const service = MOCK_SERVICES.find(s => s.name.toLowerCase().includes(serviceName.toLowerCase()));
        if (!service) {
            resolve(null);
            return;
        }

        const response: any = {
            price: `R$ ${service.price.toFixed(2)}`
        };

        if (service.instructions) {
            response.instructions = service.instructions;
        }

        // If only price is available, return just the string for simpler AI responses
        if (Object.keys(response).length === 1 && response.price) {
             resolve(response.price);
        } else {
             resolve(response);
        }
    });
};


export const bookAppointment = async (professionalName: string, date: string, time: string, patientName: string): Promise<boolean> => {
    return new Promise(resolve => {
        const professionalIndex = professionalsData.findIndex(d => d.name.toLowerCase() === professionalName.toLowerCase());
        if (professionalIndex === -1) {
            resolve(false);
            return;
        }

        // Ensure the schedule array for the date exists
        if (!professionalsData[professionalIndex].schedule[date]) {
            professionalsData[professionalIndex].schedule[date] = [];
        }

        const slotIndex = professionalsData[professionalIndex].schedule[date].findIndex(slot => slot.time === time);

        if (slotIndex !== -1 && professionalsData[professionalIndex].schedule[date][slotIndex].patient) {
            // Slot exists and is occupied
            resolve(false);
            return;
        }

        if (slotIndex !== -1) {
            // Slot exists and is free, occupy it
            professionalsData[professionalIndex].schedule[date][slotIndex].patient = patientName;
        } else {
            // Slot doesn't exist, create and occupy it
            professionalsData[professionalIndex].schedule[date].push({ time, patient: patientName });
        }
        
        resolve(true);
    });
};