
import React, { useState, useEffect } from 'react';
import { Professional, ClinicService } from '../../types';
import { getProfessionals } from '../../services/clinicService';
import { getServices } from '../../services/managementService';
import { getProfessionalAvailability } from '../../services/clinicService';
import { createAppointment } from '../../services/clinicalService';

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId: string;
    initialProfessionalId?: string;
    initialServiceId?: string;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    patientId,
    initialProfessionalId,
    initialServiceId
}) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Data
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [services, setServices] = useState<ClinicService[]>([]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Selection
    const [selectedProfessionalId, setSelectedProfessionalId] = useState(initialProfessionalId || '');
    const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || '');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadData();
            setStep(1);
            // Reset selections unless initial values provided
            if (!initialProfessionalId) setSelectedProfessionalId('');
            if (!initialServiceId) setSelectedServiceId('');
            setSelectedDate('');
            setSelectedTime('');
        }
    }, [isOpen, initialProfessionalId, initialServiceId]);

    const loadData = async () => {
        setIsLoading(true);
        const [profs, servs] = await Promise.all([
            getProfessionals(),
            getServices()
        ]);
        setProfessionals(profs);
        setServices(servs);
        setIsLoading(false);
    };

    // Fetch slots when date or professional changes
    useEffect(() => {
        if (selectedProfessionalId && selectedDate) {
            const fetchSlots = async () => {
                setIsLoading(true);
                const professional = professionals.find(p => p.id === selectedProfessionalId);
                if (professional) {
                    const slots = await getProfessionalAvailability(professional.name, selectedDate);
                    setAvailableSlots(slots);
                }
                setIsLoading(false);
            };
            fetchSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [selectedProfessionalId, selectedDate, professionals]);

    const handleSubmit = async () => {
        if (!selectedProfessionalId || !selectedServiceId || !selectedDate || !selectedTime) return;
        
        setIsSaving(true);
        try {
            await createAppointment(
                patientId,
                selectedProfessionalId,
                selectedServiceId,
                selectedDate,
                selectedTime
            );
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao agendar. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const selectedProfessional = professionals.find(p => p.id === selectedProfessionalId);
    const selectedService = services.find(s => s.id === selectedServiceId);

    // Calculate min date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="bg-[#1B7C75] p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Agendar Consulta</h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
                        <i className="ph-bold ph-x"></i>
                    </button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-[#002C3C] mb-4">Selecione o Profissional e Serviço</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                                <select 
                                    value={selectedProfessionalId}
                                    onChange={(e) => setSelectedProfessionalId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                                >
                                    <option value="">Selecione...</option>
                                    {professionals.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - {p.role}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                                <select 
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                                >
                                    <option value="">Selecione...</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-[#002C3C] mb-4">Escolha a Data</h4>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                <input 
                                    type="date" 
                                    min={minDate}
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedTime('');
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                                />
                            </div>
                            
                            {selectedDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Horários Disponíveis</label>
                                    {isLoading ? (
                                        <div className="text-center py-4 text-gray-500">Buscando horários...</div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableSlots.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 px-1 rounded text-sm font-semibold transition-colors ${
                                                        selectedTime === time 
                                                        ? 'bg-[#1B7C75] text-white' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
                                            Nenhum horário disponível nesta data.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                         <div className="space-y-4">
                            <h4 className="font-bold text-[#002C3C] mb-4">Confirmar Agendamento</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Profissional:</span>
                                    <span className="font-semibold text-right">{selectedProfessional?.name}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Serviço:</span>
                                    <span className="font-semibold text-right">{selectedService?.name}</span>
                                </div>
                                 <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Valor:</span>
                                    <span className="font-semibold text-right">R$ {selectedService?.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-500">Data e Hora:</span>
                                    <span className="font-bold text-[#1B7C75] text-right">
                                        {new Date(selectedDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {selectedTime}
                                    </span>
                                </div>
                            </div>
                         </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between">
                    {step > 1 ? (
                        <button 
                            onClick={() => setStep(s => s - 1)}
                            className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg"
                        >
                            Voltar
                        </button>
                    ) : (
                        <div></div>
                    )}
                    
                    {step < 3 ? (
                        <button 
                            onClick={() => setStep(s => s + 1)}
                            disabled={
                                (step === 1 && (!selectedProfessionalId || !selectedServiceId)) ||
                                (step === 2 && (!selectedDate || !selectedTime))
                            }
                            className="bg-[#1B7C75] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#004D5A] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Próximo
                        </button>
                    ) : (
                         <button 
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="bg-[#1B7C75] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#004D5A] flex items-center gap-2 disabled:bg-gray-300"
                        >
                            {isSaving ? 'Agendando...' : 'Confirmar'}
                            {!isSaving && <i className="ph-bold ph-check"></i>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentModal;
