
import React, { useState, useEffect, useCallback } from 'react';
import { SystemUser } from '../types';
import { getPatientPortalData, PatientPortalData } from '../services/patientService';
import { SYSTEM_USERS } from '../constants';

import DashboardTab from '../components/patient/DashboardTab';
import AppointmentsTab from '../components/patient/AppointmentsTab';
import DocumentsTab from '../components/patient/DocumentsTab';
import ProfileTab from '../components/patient/ProfileTab';

interface PatientViewProps {
  currentUser: SystemUser;
  onSwitchUser: (user: SystemUser) => void;
}

type PatientTab = 'dashboard' | 'appointments' | 'documents' | 'profile';

const PatientHeader: React.FC<{ patientName: string; onLogout: () => void; }> = ({ patientName, onLogout }) => (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="ph-bold ph-heartbeat text-3xl text-[#1B7C75]"></i>
          <h1 className="text-xl font-bold text-[#002C3C]">
            Portal do Paciente
          </h1>
        </div>
        <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 hidden sm:block">{patientName}</span>
            <button onClick={onLogout} className="text-sm text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1">
                <i className="ph ph-sign-out"></i>
                Sair
            </button>
        </div>
      </div>
    </header>
);

const TabButton: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
     <button
        onClick={onClick}
        className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 px-4 py-3 text-sm font-semibold rounded-lg
            transition-colors
            ${isActive
                ? 'bg-teal-50 text-[#1B7C75]'
                : 'text-gray-600 hover:bg-gray-100'
            }
        `}
    >
        <i className={`ph-bold ph-${icon} text-xl`}></i>
        {label}
    </button>
);


const PatientView: React.FC<PatientViewProps> = ({ currentUser, onSwitchUser }) => {
    const [activeTab, setActiveTab] = useState<PatientTab>('dashboard');
    const [portalData, setPortalData] = useState<PatientPortalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (currentUser.patientId) {
            setIsLoading(true);
            const data = await getPatientPortalData(currentUser.patientId!);
            setPortalData(data);
            setIsLoading(false);
        }
    }, [currentUser.patientId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleLogout = () => {
        // Switch to the first non-patient user (admin in this case)
        const nonPatientUser = SYSTEM_USERS.find(u => u.role !== 'patient') || SYSTEM_USERS[0];
        onSwitchUser(nonPatientUser);
    }
    
    const renderContent = () => {
        if (isLoading || !portalData || !portalData.profile) {
            return <div className="text-center p-12">Carregando seus dados...</div>;
        }

        switch (activeTab) {
            case 'dashboard':
                return <DashboardTab appointments={portalData.appointments} documents={portalData.documents} />;
            case 'appointments':
                return <AppointmentsTab 
                    appointments={portalData.appointments} 
                    patientId={currentUser.patientId!}
                    onRefresh={loadData}
                />;
            case 'documents':
                return <DocumentsTab documents={portalData.documents} />;
            case 'profile':
                return <ProfileTab patient={portalData.profile} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#F0F4F8] min-h-screen">
            <PatientHeader patientName={portalData?.profile?.name || currentUser.name} onLogout={handleLogout} />
            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                 <div className="bg-white p-2 rounded-xl shadow-md mb-6">
                    <nav className="flex flex-col sm:flex-row gap-2" aria-label="Tabs">
                        <TabButton label="Início" icon="house" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <TabButton label="Agendamentos" icon="calendar" isActive={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
                        <TabButton label="Documentos" icon="file-text" isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                        <TabButton label="Meu Perfil" icon="user" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    </nav>
                </div>
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default PatientView;
