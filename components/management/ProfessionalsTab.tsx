import React, { useState, useEffect } from 'react';
import { Professional } from '../../types';
import { getProfessionals, updateProfessional } from '../../services/managementService';
import AvailabilityCalendar from './AvailabilityCalendar';

interface ProfessionalsTabProps {
    onDataChange: () => void;
}

const ProfessionalsTab: React.FC<ProfessionalsTabProps> = ({ onDataChange }) => {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await getProfessionals();
            setProfessionals(data);
            setSelectedProfessional(data[0] || null);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleSelectProfessional = (professionalId: string) => {
        const professional = professionals.find(p => p.id === professionalId);
        setSelectedProfessional(professional || null);
    };

    const handleSave = async () => {
        if (!selectedProfessional) return;
        setIsSaving(true);
        await updateProfessional(selectedProfessional);
        // We call onDataChange to force a reload of all management data,
        // ensuring consistency across tabs if needed.
        await onDataChange();
        setIsSaving(false);
        alert('Profissional salvo com sucesso!');
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando profissionais...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-md h-fit">
                <h3 className="font-bold text-lg text-[#002C3C] mb-4">Profissionais de Saúde</h3>
                <ul className="space-y-2">
                    {professionals.map(prof => (
                        <li key={prof.id}>
                            <button
                                onClick={() => handleSelectProfessional(prof.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                    selectedProfessional?.id === prof.id
                                        ? 'bg-[#004D5A] text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <p className="font-semibold">{prof.name}</p>
                                <p className={`text-sm ${selectedProfessional?.id === prof.id ? 'text-gray-200' : 'text-gray-500'}`}>{prof.role}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md">
                {selectedProfessional ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-lg text-[#002C3C]">Editando Perfil e Disponibilidade</h3>
                             <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-[#1B7C75] hover:bg-[#004D5A] text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                       
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="prof-name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <input
                                    type="text"
                                    id="prof-name"
                                    value={selectedProfessional.name}
                                    onChange={(e) => setSelectedProfessional({ ...selectedProfessional, name: e.target.value })}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                                />
                            </div>
                             <div>
                                <label htmlFor="prof-role" className="block text-sm font-medium text-gray-700">Função / Especialidade</label>
                                <input
                                    type="text"
                                    id="prof-role"
                                    value={selectedProfessional.role}
                                    onChange={(e) => setSelectedProfessional({ ...selectedProfessional, role: e.target.value })}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                                />
                            </div>
                        </div>

                        <AvailabilityCalendar
                            professional={selectedProfessional}
                            onProfessionalChange={setSelectedProfessional}
                        />
                    </div>
                ) : (
                    <p>Selecione um profissional para editar.</p>
                )}
            </div>
        </div>
    );
};

export default ProfessionalsTab;