

import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FinanceView from './views/FinanceView';
import AgendaView from './views/AgendaView';
import SettingsView from './views/SettingsView';
import ManagementView from './views/ManagementView';
import ClinicalView from './views/ClinicalView';
import HomeView from './views/HomeView';
import MarketingView from './views/MarketingView';
import PatrimonyView from './views/PatrimonyView';
import InventoryView from './views/InventoryView';
import PatientView from './views/PatientView';
import PublicWebsiteView from './views/public/PublicWebsiteView';
import ProfileSettingsView from './views/ProfileSettingsView';
import BackendTestView from './views/BackendTestView';
import AccessDenied from './components/common/AccessDenied';
import CallPanel from './components/common/CallPanel';
import { View, SystemUser } from './types';
import { SYSTEM_USERS, ROLE_PERMISSIONS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<SystemUser>(SYSTEM_USERS[0]); // Default to Dra. Gisele
  const [activeCall, setActiveCall] = useState<{ patientName: string; professionalName: string; room: string } | null>(null);

  const handleCallPatient = (patientName: string, professionalName: string, room: string) => {
    setActiveCall({ patientName, professionalName, room });
  };

  const handleDismissCall = () => {
    setActiveCall(null);
  };

  const handleViewChange = (view: View) => {
    if (ROLE_PERMISSIONS[currentUser.role].includes(view)) {
      setActiveView(view);
    } else {
      const fallbackView = ROLE_PERMISSIONS[currentUser.role][0] || 'home';
      setActiveView(fallbackView);
    }
  };
  
  const handleUserChange = (user: SystemUser) => {
    setCurrentUser(user);
    // If switching to a non-public/non-patient role, check if they can see the current view.
    if (!['patient', 'public', 'backend_tester'].includes(user.role) && !ROLE_PERMISSIONS[user.role].includes(activeView)) {
      // If not, send them to their default view.
      setActiveView(ROLE_PERMISSIONS[user.role][0] || 'home');
    } else if (user.role === 'public') {
      setActiveView('website');
    } else if (user.role === 'backend_tester') {
        setActiveView('backend_test');
    }
  };

  if (currentUser.role === 'public') {
    return <PublicWebsiteView onSwitchUser={handleUserChange} />;
  }
  
  if (currentUser.role === 'patient') {
    return <PatientView currentUser={currentUser} onSwitchUser={handleUserChange} />;
  }

  if (currentUser.role === 'backend_tester') {
    return <BackendTestView currentUser={currentUser} onSwitchUser={handleUserChange} />;
  }

  const hasAccessToCurrentView = ROLE_PERMISSIONS[currentUser.role].includes(activeView);

  const renderView = () => {
    if (!hasAccessToCurrentView) {
      return <AccessDenied />;
    }

    switch(activeView) {
      case 'home':
        return <HomeView currentUser={currentUser} setActiveView={handleViewChange} />;
      case 'finance':
        return <FinanceView />;
      case 'agenda':
        return <AgendaView />;
      case 'clinical':
        return <ClinicalView onCallPatient={handleCallPatient} />;
      case 'marketing':
        return <MarketingView setActiveView={handleViewChange} />;
      case 'patrimony':
        return <PatrimonyView />;
      case 'inventory':
        return <InventoryView />;
      case 'settings':
        return <SettingsView />;
      case 'management':
        return <ManagementView />;
      case 'profile_settings':
        return <ProfileSettingsView currentUser={currentUser} />;
      default:
        return <HomeView currentUser={currentUser} setActiveView={handleViewChange} />;
    }
  }

  return (
    <div className="bg-[#F0F4F8] min-h-screen">
      <Header activeView={activeView} currentUser={currentUser} setCurrentUser={handleUserChange} />
      <div className="flex">
        <Sidebar 
          activeView={activeView} 
          setActiveView={handleViewChange} 
          currentUser={currentUser}
        />
        <main className="flex-1 transition-all duration-300">
           {renderView()}
        </main>
      </div>
      {activeCall && <CallPanel {...activeCall} onDismiss={handleDismissCall} />}
    </div>
  );
};

export default App;