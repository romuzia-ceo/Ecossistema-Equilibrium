import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FinanceView from './views/FinanceView';
import AgendaView from './views/AgendaView';
import SettingsView from './views/SettingsView';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('agenda');

  const renderView = () => {
    switch(activeView) {
      case 'finance':
        return <FinanceView />;
      case 'agenda':
        return <AgendaView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <FinanceView />;
    }
  }

  return (
    <div className="bg-[#F0F4F8] min-h-screen">
      <Header activeView={activeView} />
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 transition-all duration-300">
           {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;