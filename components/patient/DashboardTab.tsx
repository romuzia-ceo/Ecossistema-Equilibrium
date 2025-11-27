
import React from 'react';
import { ClinicalAppointment, GeneratedDocument, ClinicalAppointmentStatus } from '../../types';

interface DashboardTabProps {
    appointments: ClinicalAppointment[];
    documents: GeneratedDocument[];
}

const InfoCard: React.FC<{
    title: string;
    icon: string;
    children: React.ReactNode;
}> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-full">
                <i className={`ph-bold ph-${icon} text-2xl text-[#1B7C75]`}></i>
            </div>
            <h3 className="text-lg font-bold text-[#002C3C]">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);


const DashboardTab: React.FC<DashboardTabProps> = ({ appointments, documents }) => {
    
    const now = new Date(); // Revertido para horário atual
    const nextAppointment = appointments
        .filter(a => now < new Date(`2025-11-20T${a.time}:00`) && a.status !== ClinicalAppointmentStatus.FINALIZADO)
        .sort((a, b) => a.time.localeCompare(b.time))[0];
        
    const recentDocuments = documents.slice(0, 3);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard title="Próximo Agendamento" icon="calendar-check">
                {nextAppointment ? (
                    <div>
                        <p className="text-2xl font-bold text-[#004D5A]">
                            {new Date(`1970-01-01T${nextAppointment.time}:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {nextAppointment.time}
                        </p>
                        <p className="text-gray-600 mt-1">{nextAppointment.service.name}</p>
                        <p className="text-gray-600">com {nextAppointment.professional.name}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Você não tem agendamentos futuros.</p>
                )}
            </InfoCard>

            <InfoCard title="Documentos Recentes" icon="files">
                {recentDocuments.length > 0 ? (
                    <ul className="space-y-2">
                        {recentDocuments.map(doc => (
                             <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                 <div>
                                    <p className="font-semibold text-sm text-gray-800">{doc.title}</p>
                                    <p className="text-xs text-gray-500">Emitido em {new Date(doc.createdAt).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                 </div>
                                 <button className="text-[#1B7C75] hover:text-[#004D5A]">
                                    <i className="ph ph-download-simple text-xl"></i>
                                 </button>
                             </li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-gray-500">Nenhum documento encontrado.</p>
                )}
            </InfoCard>
        </div>
    );
};

export default DashboardTab;
