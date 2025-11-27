import React from 'react';
import { ClinicalAppointment, ClinicalAppointmentStatus } from '../../types';

interface WaitingQueueProps {
    appointments: ClinicalAppointment[];
    onSelectAppointment: (appointment: ClinicalAppointment) => void;
    selectedAppointmentId?: string | null;
    onCallPatient: (patientName: string, professionalName: string, room: string) => void;
}

const getStatusStyles = (status: ClinicalAppointmentStatus) => {
    switch (status) {
        case ClinicalAppointmentStatus.AGUARDANDO:
            return 'bg-blue-100 text-blue-800';
        case ClinicalAppointmentStatus.EM_ATENDIMENTO:
            return 'bg-yellow-100 text-yellow-800 animate-pulse';
        case ClinicalAppointmentStatus.FINALIZADO:
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const AppointmentCard: React.FC<{
    appointment: ClinicalAppointment;
    onSelect: () => void;
    onCall: () => void;
    isSelected: boolean;
}> = ({ appointment, onSelect, onCall, isSelected }) => {
    
    const canStartAttendance = appointment.status === ClinicalAppointmentStatus.AGUARDANDO;
    const canCall = appointment.status === ClinicalAppointmentStatus.AGUARDANDO;
    
    return (
        <li className={`p-4 rounded-xl transition-all ${isSelected ? 'bg-[#004D5A]/10 ring-2 ring-[#004D5A]' : 'bg-white shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-md text-[#002C3C]">{appointment.patient.name}</p>
                    <p className="text-sm text-gray-500">{appointment.service.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="font-bold text-lg text-[#004D5A]">{appointment.time}</p>
                     <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyles(appointment.status)}`}>
                        {appointment.status}
                    </span>
                </div>
            </div>
             <div className="mt-3 flex justify-end gap-2">
                {canCall && (
                     <button 
                        onClick={onCall}
                        className="bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-200"
                    >
                        <i className="ph-bold ph-speaker-simple-high mr-1"></i>
                        Chamar
                    </button>
                )}
                {canStartAttendance && !isSelected && (
                    <button 
                        onClick={onSelect}
                        className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-[#004D5A]"
                    >
                        <i className="ph-bold ph-play-circle mr-1"></i>
                        Iniciar Atendimento
                    </button>
                )}
            </div>
        </li>
    )
};


const WaitingQueue: React.FC<WaitingQueueProps> = ({ appointments, onSelectAppointment, selectedAppointmentId, onCallPatient }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 h-full flex flex-col">
            <h3 className="font-bold text-lg text-[#002C3C] mb-4 px-2">Fila de Atendimento - Hoje</h3>
            <div className="flex-grow overflow-y-auto scrollbar-hide -mr-2 pr-2">
                <ul className="space-y-3">
                    {appointments.map(app => (
                        <AppointmentCard 
                            key={app.id}
                            appointment={app}
                            onSelect={() => onSelectAppointment(app)}
                            onCall={() => onCallPatient(app.patient.name, `Dr(a). ${app.professional.name.split(' ').slice(1).join(' ')}`, `Consultório ${app.professional.name.split(' ').pop()}`)}
                            isSelected={app.id === selectedAppointmentId}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WaitingQueue;