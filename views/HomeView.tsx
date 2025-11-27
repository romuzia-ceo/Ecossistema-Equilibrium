
import React from 'react';
import { SystemUser, View } from '../types';
import { MOCK_TODAYS_APPOINTMENTS } from '../constants';

interface HomeViewProps {
  currentUser: SystemUser;
  setActiveView: (view: View) => void;
}

const ShortcutCard: React.FC<{ title: string; icon: string; onClick: () => void; }> = ({ title, icon, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-2xl shadow-md text-center hover:bg-teal-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
        <i className={`ph-bold ph-${icon} text-4xl text-[#1B7C75] mb-2`}></i>
        <p className="font-semibold text-[#002C3C]">{title}</p>
    </button>
);

const ProfessionalDashboard: React.FC<{ user: SystemUser; setActiveView: (view: View) => void; }> = ({ user, setActiveView }) => {
    // Revertendo para a lógica anterior (que pode não encontrar correspondência se os nomes diferirem)
    const myTodaysAppointments = MOCK_TODAYS_APPOINTMENTS
        .filter(a => a.professional.name === user.name && a.status !== 'Finalizado')
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div>
            <h2 className="text-3xl font-bold text-[#002C3C] mb-2">Bem-vinda, {user.name.split(' (')[0]}!</h2>
            <p className="text-gray-600 mb-8">Aqui está um resumo do seu dia. Pronto para começar?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-bold text-lg text-[#004D5A] mb-4">Próximos Pacientes</h3>
                    <ul className="space-y-3">
                        {myTodaysAppointments.length > 0 ? myTodaysAppointments.map(a => (
                             <li key={a.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                <i className="ph-fill ph-timer text-xl text-yellow-500"></i>
                                <div>
                                    <p className="font-semibold text-gray-900">{a.patient.name}</p>
                                    <p className="text-sm text-gray-500">{a.time} - {a.service.name}</p>
                                </div>
                            </li>
                        )) : <p className="text-sm text-gray-500">Nenhum agendamento pendente para hoje.</p>}
                    </ul>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-6">
                    <ShortcutCard title="Ver Fila de Atendimento" icon="stethoscope" onClick={() => setActiveView('clinical')} />
                    <ShortcutCard title="Ver Agenda Completa" icon="calendar" onClick={() => setActiveView('agenda')} />
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<{ user: SystemUser; setActiveView: (view: View) => void; }> = ({ user, setActiveView }) => {
    const totalAppointments = MOCK_TODAYS_APPOINTMENTS.length;
    return (
        <div>
            <h2 className="text-3xl font-bold text-[#002C3C] mb-2">Painel do Administrador</h2>
            <p className="text-gray-600 mb-8">Visão geral da clínica e atalhos para os módulos de gestão.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ShortcutCard title="Gestão de Profissionais" icon="user-list" onClick={() => setActiveView('management')} />
                <ShortcutCard title="Análise Financeira" icon="chart-bar" onClick={() => setActiveView('finance')} />
                <ShortcutCard title="Configurar Agenda" icon="calendar-check" onClick={() => setActiveView('agenda')} />
                <ShortcutCard title="Configurações Gerais" icon="gear" onClick={() => setActiveView('settings')} />
            </div>
        </div>
    )
};

const DefaultDashboard: React.FC<{ user: SystemUser; setActiveView: (view: View) => void; }> = ({ user, setActiveView }) => {
    // A generic dashboard for roles like reception, finance, etc.
     return (
        <div>
            <h2 className="text-3xl font-bold text-[#002C3C] mb-2">Bem-vindo(a), {user.name.split(' (')[0]}!</h2>
            <p className="text-gray-600 mb-8">Selecione um módulo no menu lateral para começar.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ShortcutCard title="Atendimento Clínico" icon="stethoscope" onClick={() => setActiveView('clinical')} />
                <ShortcutCard title="Agenda Inteligente" icon="calendar-check" onClick={() => setActiveView('agenda')} />
                {user.role === 'finance' && <ShortcutCard title="BI Financeiro" icon="chart-bar" onClick={() => setActiveView('finance')} />}
            </div>
        </div>
    )
};


const HomeView: React.FC<HomeViewProps> = ({ currentUser, setActiveView }) => {
    const renderDashboard = () => {
        switch (currentUser.role) {
            case 'professional':
                return <ProfessionalDashboard user={currentUser} setActiveView={setActiveView} />;
            case 'admin':
                return <AdminDashboard user={currentUser} setActiveView={setActiveView} />;
            default:
                return <DefaultDashboard user={currentUser} setActiveView={setActiveView} />;
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {renderDashboard()}
        </div>
    );
};

export default HomeView;
