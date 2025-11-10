import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg
      ${isActive
        ? 'bg-[#004D5A] text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-[#002C3C]'}
    `}
  >
    <i className={`ph-bold ph-${icon} text-2xl`}></i>
    <span className="font-semibold">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="w-64 bg-white p-4 h-[calc(100vh-68px)] sticky top-[68px] shadow-sm flex flex-col justify-between">
      <ul className="space-y-2">
        <NavItem
          icon="chart-bar"
          label="BI Financeiro"
          isActive={activeView === 'finance'}
          onClick={() => setActiveView('finance')}
        />
        <NavItem
          icon="calendar-check"
          label="Agenda Inteligente"
          isActive={activeView === 'agenda'}
          onClick={() => setActiveView('agenda')}
        />
      </ul>
       <ul className="space-y-2">
        <NavItem
          icon="gear"
          label="Configurações"
          isActive={activeView === 'settings'}
          onClick={() => setActiveView('settings')}
        />
      </ul>
    </nav>
  );
};

export default Sidebar;