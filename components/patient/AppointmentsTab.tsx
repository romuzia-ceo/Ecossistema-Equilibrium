
import React, { useState } from 'react';
import { ClinicalAppointment, ClinicalAppointmentStatus } from '../../types';
import BookAppointmentModal from './BookAppointmentModal';

interface AppointmentsTabProps {
    appointments: ClinicalAppointment[];
    patientId: string;
    onRefresh: () => void;
}

const AppointmentCard: React.FC<{ 
    appointment: ClinicalAppointment; 
    isPast?: boolean; 
    onBookReturn?: () => void 
}> = ({ appointment, isPast = false, onBookReturn }) => (
    <div className={`p-4 rounded-xl flex items-start gap-4 ${isPast ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
        <div className="flex-shrink-0 text-center w-16">
            <p className="text-2xl font-bold text-[#004D5A]">{new Date(`1970-01-01T${appointment.time}:00`).getDate()}</p>
            <p className="text-sm text-gray-500 -mt-1">{new Date(`1970-01-01T${appointment.time}:00`).toLocaleString('pt-BR', { month: 'short' })}</p>
            <p className="text-lg font-semibold text-[#002C3C] mt-1">{appointment.time}</p>
        </div>
        <div className="flex-grow">
            <p className="font-bold text-md text-[#002C3C]">{appointment.service.name}</p>
            <p className="text-sm text-gray-600">com {appointment.professional.name} ({appointment.professional.role})</p>
            {!isPast && (
                <div className="mt-3">
                    <button className="text-sm font-semibold text-red-600 hover:text-red-800">Cancelar Agendamento</button>
                </div>
            )}
            {isPast && onBookReturn && (
                <div className="mt-3">
                    <button 
                        onClick={onBookReturn}
                        className="text-sm font-bold text-[#1B7C75] hover:text-[#004D5A] flex items-center gap-1"
                    >
                        <i className="ph-bold ph-arrow-u-up-left"></i>
                        Agendar Retorno
                    </button>
                </div>
            )}
        </div>
    </div>
);

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ appointments, patientId, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialData, setInitialData] = useState<{ professionalId?: string, serviceId?: string }>({});

    const now = new Date(`2025-11-20T10:30:00`); // Fixed time for consistent demo
    
    const upcomingAppointments = appointments
        .filter(a => {
            const appTime = a.time.includes(':') ? a.time : '00:00';
            // Very rough check for "upcoming" based on mock time logic
            // In real app we compare ISO dates.
            return new Date(`2025-11-20T${appTime}:00`) >= now && a.status !== ClinicalAppointmentStatus.FINALIZADO;
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    const pastAppointments = appointments
        .filter(a => {
            const appTime = a.time.includes(':') ? a.time : '00:00';
            return new Date(`2025-11-20T${appTime}:00`) < now || a.status === ClinicalAppointmentStatus.FINALIZADO;
        })
        .sort((a, b) => b.time.localeCompare(a.time));

    const handleNewAppointment = () => {
        setInitialData({});
        setIsModalOpen(true);
    };

    const handleBookReturn = (professionalId: string, serviceId: string) => {
        setInitialData({ professionalId, serviceId });
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        onRefresh();
        // Optionally show a toast message here
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#002C3C]">Meus Agendamentos</h3>
                <button 
                    onClick={handleNewAppointment}
                    className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-[#004D5A] flex items-center gap-2"
                >
                    <i className="ph-bold ph-plus"></i>
                    Novo Agendamento
                </button>
            </div>

            <section>
                <h4 className="text-lg font-semibold text-[#004D5A] mb-4">Próximos</h4>
                {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl text-center text-gray-500">
                        Você não possui agendamentos futuros.
                    </div>
                )}
            </section>

            <section className="mt-8">
                <h4 className="text-lg font-semibold text-[#004D5A] mb-4">Histórico</h4>
                {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                         {pastAppointments.map(app => (
                             <AppointmentCard 
                                key={app.id} 
                                appointment={app} 
                                isPast 
                                onBookReturn={() => handleBookReturn(app.professional.id, app.service.id)}
                            />
                         ))}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl text-center text-gray-500">
                        Nenhum agendamento anterior encontrado.
                    </div>
                )}
            </section>

            <BookAppointmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                patientId={patientId}
                initialProfessionalId={initialData.professionalId}
                initialServiceId={initialData.serviceId}
            />
        </div>
    );
};

export default AppointmentsTab;
