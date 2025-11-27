import React, { useState, useEffect } from 'react';
import { SystemUser, Professional } from '../types';
import { getProfessionalById, updateProfessional } from '../services/managementService';
import AvailabilityCalendar from '../components/management/AvailabilityCalendar';

interface ProfileSettingsViewProps {
    currentUser: SystemUser;
}

const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ currentUser }) => {
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (currentUser.professionalId) {
                setIsLoading(true);
                const data = await getProfessionalById(currentUser.professionalId);
                setProfessional(data);
                setIsLoading(false);
            }
        };
        loadData();
    }, [currentUser]);

    const handleSave = async () => {
        if (!professional) return;
        setIsSaving(true);
        await updateProfessional(professional);
        setIsSaving(false);
        // Add a success notification/toast here in a real app
        alert('Perfil e agenda atualizados com sucesso!');
    };

    if (isLoading) {
        return <div className="text-center p-8">Carregando seu perfil...</div>;
    }

    if (!professional) {
        return <div className="text-center p-8 text-red-600">Erro: Perfil profissional não encontrado.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#002C3C]">Meu Perfil e Disponibilidade</h2>
                     <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#1B7C75] hover:bg-[#004D5A] text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:bg-gray-400"
                    >
                         {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Salvando...
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="prof-name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input
                            type="text"
                            id="prof-name"
                            value={professional.name}
                            onChange={(e) => setProfessional({ ...professional, name: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                        />
                    </div>
                    <div>
                        <label htmlFor="prof-role" className="block text-sm font-medium text-gray-700">Função / Especialidade</label>
                        <input
                            type="text"
                            id="prof-role"
                            value={professional.role}
                            onChange={(e) => setProfessional({ ...professional, role: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B7C75] focus:border-[#1B7C75]"
                        />
                    </div>
                </div>

                <AvailabilityCalendar
                    professional={professional}
                    onProfessionalChange={setProfessional}
                />
            </div>
        </div>
    );
};

export default ProfileSettingsView;