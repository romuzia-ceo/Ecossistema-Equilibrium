

import React from 'react';
import { View, SystemUser } from '../types';
import UserSwitcher from './UserSwitcher';

interface HeaderProps {
  activeView: View;
  currentUser: SystemUser;
  setCurrentUser: (user: SystemUser) => void;
}

const viewTitles: Record<View, string> = {
  home: 'Início',
  finance: 'BI Financeiro',
  agenda: 'Agenda Inteligente',
  clinical: 'Atendimento Clínico',
  marketing: 'Marketing Inteligente',
  settings: 'Configurações',
  management: 'Gestão da Clínica',
  patrimony: 'Gestão Patrimonial',
  inventory: 'Gestão de Estoque',
  website: 'Portal de Saúde',
  // FIX: Added 'profile_settings' to match the View type.
  profile_settings: 'Meu Perfil & Agenda',
  backend_test: 'Teste de Backend',
};

const EquilibriumLogo: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1B7C75]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
    <path d="M12 12.75c1.63 0 3.07.99 3.68 2.37l1.87-.78C16.63 12.28 14.51 11 12 11s-4.63 1.28-5.55 3.34l1.87.78C8.93 13.74 10.37 12.75 12 12.75z" fill="currentColor"/>
    <path d="M12 8.25c-1.63 0-3.07.99-3.68 2.37l-1.87-.78C7.37 7.72 9.49 6.5 12 6.5s4.63 1.28 5.55 3.34l-1.87.78C15.07 9.24 13.63 8.25 12 8.25z" fill="currentColor"/>
  </svg>
);


const Header: React.FC<HeaderProps> = ({ activeView, currentUser, setCurrentUser }) => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <EquilibriumLogo />
          <h1 className="text-xl font-bold text-[#002C3C]">
            Ecossistema Equilibrium 
            <span className="font-normal text-gray-500 hidden sm:inline">
              {' / ' + (viewTitles[activeView] || 'Módulo')}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <i className="ph ph-bell text-2xl text-gray-500 hover:text-[#004D5A] cursor-pointer"></i>
            <UserSwitcher currentUser={currentUser} onUserChange={setCurrentUser} />
        </div>
      </div>
    </header>
  );
};

export default Header;