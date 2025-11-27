import React from 'react';
import { View, SystemUser } from '../types';
import { ROLE_PERMISSIONS } from '../constants';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  currentUser: SystemUser;
}

interface NavItemConfig {
  id: View;
  label: string;
  icon: string;
}

const ALL_NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Início', icon: 'house' },
  { id: 'clinical', label: 'Atendimento Clínico', icon: 'stethoscope' },
  { id: 'agenda', label: 'Agenda Inteligente', icon: 'calendar-check' },
  { id: 'finance', label: 'BI Financeiro', icon: 'chart-bar' },
  { id: 'marketing', label: 'Marketing', icon: 'megaphone-simple' },
  { id: 'management', label: 'Gestão da Clínica', icon: 'buildings' },
  { id: 'patrimony', label: 'Gestão Patrimonial', icon: 'wrench' },
  { id: 'inventory', label: 'Gestão de Estoque', icon: 'package' },
];

const PROFESSIONAL_NAV_ITEMS: NavItemConfig[] = [
    { id: 'profile_settings', label: 'Meu Perfil & Agenda', icon: 'user-circle-gear' },
];

const SETTINGS_NAV_ITEM: NavItemConfig = {
  id: 'settings',
  label: 'Configurações',
  icon: 'gear',
};

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

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUser }) => {
  const userPermissions = ROLE_PERMISSIONS[currentUser.role] || [];

  const visibleNavItems = ALL_NAV_ITEMS.filter(item => userPermissions.includes(item.id));
  const professionalNavItems = PROFESSIONAL_NAV_ITEMS.filter(item => userPermissions.includes(item.id));
  const canSeeSettings = userPermissions.includes('settings');
  
  if (currentUser.role === 'public') {
      return null; // Don't render sidebar for public website view
  }

  return (
    <nav className="w-64 bg-white p-4 h-[calc(100vh-68px)] sticky top-[68px] shadow-sm flex flex-col justify-between z-10">
      <div>
        <ul className="space-y-2">
            {visibleNavItems.map(item => (
            <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => setActiveView(item.id)}
            />
            ))}
        </ul>
        {professionalNavItems.length > 0 && (
            <>
                <hr className="my-4" />
                <ul className="space-y-2">
                    {professionalNavItems.map(item => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeView === item.id}
                            onClick={() => setActiveView(item.id)}
                        />
                    ))}
                </ul>
            </>
        )}
      </div>
      {canSeeSettings && (
        <ul className="space-y-2">
          <NavItem
            icon={SETTINGS_NAV_ITEM.icon}
            label={SETTINGS_NAV_ITEM.label}
            isActive={activeView === SETTINGS_NAV_ITEM.id}
            onClick={() => setActiveView(SETTINGS_NAV_ITEM.id)}
          />
        </ul>
      )}
    </nav>
  );
};

export default Sidebar;