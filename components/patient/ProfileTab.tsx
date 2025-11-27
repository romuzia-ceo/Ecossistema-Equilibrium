import React from 'react';
import { Patient } from '../../types';

interface ProfileTabProps {
    patient: Patient;
}

const ProfileField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
        <p className="text-md text-gray-800">{value}</p>
    </div>
);

const ProfileTab: React.FC<ProfileTabProps> = ({ patient }) => {
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
             <h3 className="text-xl font-bold text-[#002C3C] mb-6">Minhas Informações</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <ProfileField label="Nome Completo" value={patient.name} />
                <ProfileField label="CPF" value={patient.cpf} />
                <ProfileField 
                    label="Data de Nascimento" 
                    value={`${new Date(patient.birthDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} (${calculateAge(patient.birthDate)} anos)`}
                />
                <ProfileField label="Gênero" value={patient.gender} />
                <ProfileField label="Telefone de Contato" value={patient.phone} />
            </div>

            <div className="mt-8 border-t pt-6 text-right">
                <button className="bg-[#1B7C75] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#004D5A]">
                    Editar Informações
                </button>
            </div>
        </div>
    );
};

export default ProfileTab;