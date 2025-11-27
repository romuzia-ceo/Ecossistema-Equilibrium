import React, { useState } from 'react';
import ProfessionalsTab from '../components/management/ProfessionalsTab';
import ServicesTab from '../components/management/ServicesTab';
import UsersTab from '../components/management/UsersTab';
import TemplatesTab from '../components/management/TemplatesTab';
import InsuranceTab from '../components/management/InsuranceTab';
import { ManagementTab } from '../types';

const TabButton: React.FC<{
    label: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2
            transition-colors
            ${isActive
                ? 'text-[#1B7C75] border-[#1B7C75]'
                : 'text-gray-500 border-transparent hover:text-[#004D5A] hover:border-gray-300'
            }
        `}
    >
        <i className={`ph-bold ph-${icon} text-xl`}></i>
        {label}
    </button>
);


const ManagementView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ManagementTab>('professionals');
    const [dataVersion, setDataVersion] = useState(0);
    const refreshData = () => setDataVersion(v => v + 1);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'professionals':
                return <ProfessionalsTab key={dataVersion} onDataChange={refreshData} />;
            case 'services':
                return <ServicesTab key={dataVersion} onDataChange={refreshData} />;
            case 'users':
                return <UsersTab key={dataVersion} onDataChange={refreshData} />;
            case 'templates':
                return <TemplatesTab key={dataVersion} onDataChange={refreshData} />;
            case 'insurance':
                return <InsuranceTab key={dataVersion} onDataChange={refreshData} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    <TabButton
                        label="Profissionais"
                        icon="user-list"
                        isActive={activeTab === 'professionals'}
                        onClick={() => setActiveTab('professionals')}
                    />
                    <TabButton
                        label="Serviços"
                        icon="first-aid-kit"
                        isActive={activeTab === 'services'}
                        onClick={() => setActiveTab('services')}
                    />
                    <TabButton
                        label="Convênios"
                        icon="shield-check"
                        isActive={activeTab === 'insurance'}
                        onClick={() => setActiveTab('insurance')}
                    />
                    <TabButton
                        label="Usuários"
                        icon="users-three"
                        isActive={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                     <TabButton
                        label="Modelos"
                        icon="file-text"
                        isActive={activeTab === 'templates'}
                        onClick={() => setActiveTab('templates')}
                    />
                </nav>
            </div>
            
            <div>
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default ManagementView;