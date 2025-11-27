import React, { useState, useEffect } from 'react';
import WaitingQueue from '../components/clinical/WaitingQueue';
import AttendanceArea from '../components/clinical/AttendanceArea';
import BillingModal from '../components/billing/BillingModal';
import { ClinicalAppointment, ClinicalAppointmentStatus } from '../types';
import { getTodaysAppointments, updateAppointmentStatus } from '../services/clinicalService';

interface ClinicalViewProps {
    onCallPatient: (patientName: string, professionalName: string, room: string) => void;
}

const ClinicalView: React.FC<ClinicalViewProps> = ({ onCallPatient }) => {
    const [appointments, setAppointments] = useState<ClinicalAppointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<ClinicalAppointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [billingAppointment, setBillingAppointment] = useState<ClinicalAppointment | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setIsLoading(true);
        const data = await getTodaysAppointments();
        setAppointments(data);
        
        const inAttendance = data.find(a => a.status === ClinicalAppointmentStatus.EM_ATENDIMENTO);
        setSelectedAppointment(inAttendance || null);
        
        setIsLoading(false);
    };

    const handleSelectAppointment = async (appointment: ClinicalAppointment) => {
        await updateAppointmentStatus(appointment.id, ClinicalAppointmentStatus.EM_ATENDIMENTO);
        const updatedAppointments = await getTodaysAppointments();
        setAppointments(updatedAppointments);
        const currentAppointment = updatedAppointments.find(a => a.id === appointment.id);
        setSelectedAppointment(currentAppointment || null);
    };

    const handleStartBilling = (appointmentId: string) => {
        const appointmentToBill = appointments.find(a => a.id === appointmentId);
        if (appointmentToBill) {
            setBillingAppointment(appointmentToBill);
        }
    };
    
    const handleBillingSuccess = async () => {
        if (billingAppointment) {
            await updateAppointmentStatus(billingAppointment.id, ClinicalAppointmentStatus.FINALIZADO);
            setBillingAppointment(null);
            setSelectedAppointment(null); // Clear the attendance area
            await loadAppointments(); // Refresh the whole list
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando agendamentos do dia...</div>;
    }

    return (
        <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-84px)] overflow-hidden">
            <div className="grid grid-cols-12 gap-6 h-full">
                <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full flex flex-col">
                    <WaitingQueue 
                        appointments={appointments}
                        onSelectAppointment={handleSelectAppointment}
                        selectedAppointmentId={selectedAppointment?.id}
                        onCallPatient={onCallPatient}
                    />
                </div>
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-full flex flex-col">
                   <AttendanceArea 
                        appointment={selectedAppointment}
                        onFinalize={handleStartBilling}
                   />
                </div>
            </div>
            {billingAppointment && (
                <BillingModal
                    appointment={billingAppointment}
                    onClose={() => setBillingAppointment(null)}
                    onSuccess={handleBillingSuccess}
                />
            )}
        </div>
    );
};

export default ClinicalView;