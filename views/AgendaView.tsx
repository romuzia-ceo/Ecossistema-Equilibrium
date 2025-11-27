
import React, { useState, useMemo, useEffect } from 'react';
import ChatInterface from '../components/agenda/ChatInterface';
import CalendarView from '../components/agenda/CalendarView';
import ConversationList from '../components/agenda/ConversationList';
import { MOCK_CONVERSATIONS } from '../constants';
import { WhatsAppConversation, Message, Professional } from '../types';
import { getAgendaResponse } from '../services/agendaService';
import { getProfessionals as getProfessionalsFromClinicService } from '../services/clinicService';
import { checkGoogleCalendarStatus, syncAppointmentsToGoogle, getLastSyncTime } from '../services/googleIntegrationService';


const AgendaView: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('convo-1');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  
  // Google Sync States
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
        const fetchedProfessionals = await getProfessionalsFromClinicService();
        setProfessionals(fetchedProfessionals);
        setSelectedProfessionalId(fetchedProfessionals[0]?.id || null);
        
        const googleStatus = await checkGoogleCalendarStatus();
        setIsGoogleConnected(googleStatus);
        setLastSync(getLastSyncTime());
    }
    initData();
  }, []);

  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const selectedProfessional = useMemo(() => {
      return professionals.find(d => d.id === selectedProfessionalId);
  }, [professionals, selectedProfessionalId])

  const handleSendMessage = async (text: string, conversationId: string) => {
    if (!selectedConversation) return;

    const staffMessage: Message = {
      id: Date.now(),
      text,
      sender: 'staff',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Atualiza a UI com a mensagem do atendente imediatamente
    updateConversation(conversationId, [...selectedConversation.messages, staffMessage]);
    
    // Chama a IA, que agora gerencia seu próprio histórico
    const { responseText, appointmentBooked } = await getAgendaResponse(
        text, 
        conversationId, // Passa o ID para o serviço gerenciar a sessão
        selectedConversation.patientName
    );

    const botMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Atualiza a UI com a resposta final do bot
    updateConversation(conversationId, [...selectedConversation.messages, staffMessage, botMessage]);

    // Se um agendamento foi confirmado, atualiza os dados dos profissionais para refletir na agenda
    if (appointmentBooked) {
        const updatedProfessionals = await getProfessionalsFromClinicService();
        setProfessionals(updatedProfessionals);
    }
  };
  
  const updateConversation = (conversationId: string, newMessages: Message[]) => {
      setConversations(prev => prev.map(c => 
          c.id === conversationId 
          ? { ...c, messages: newMessages, lastMessageSnippet: newMessages[newMessages.length-1].text.substring(0, 40) + '...', lastMessageTimestamp: newMessages[newMessages.length-1].timestamp } 
          : c
      ));
  }

  const handleSyncGoogle = async () => {
      if(!isGoogleConnected) return;
      setIsSyncing(true);
      const count = await syncAppointmentsToGoogle();
      setIsSyncing(false);
      setLastSync(getLastSyncTime());
      alert(`${count} agendamentos sincronizados com o Google Agenda.`);
  }


  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-84px)] overflow-hidden flex flex-col">
      
      {/* Header Toolbar with Sync Status */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm shrink-0">
          <h2 className="font-bold text-xl text-[#002C3C] flex items-center gap-2">
              <i className="ph-fill ph-calendar-check text-[#1B7C75]"></i>
              Gestão de Agenda
          </h2>
          {isGoogleConnected ? (
              <button 
                onClick={handleSyncGoogle}
                disabled={isSyncing}
                className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                title={lastSync ? `Última sincronização: ${lastSync}` : 'Clique para forçar a sincronização'}
              >
                  {isSyncing ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                      <i className="ph-bold ph-arrows-clockwise"></i>
                  )}
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar com Google'}
              </button>
          ) : (
              <div className="text-sm text-gray-400 flex items-center gap-2 px-4 py-2">
                  <i className="ph ph-plugs-disconnected"></i>
                  Google Agenda Desconectado
              </div>
          )}
      </div>

      <div className="grid grid-cols-12 gap-6 flex-grow overflow-hidden">
        <div className="col-span-12 lg:col-span-3 h-full flex flex-col overflow-hidden">
          <ConversationList 
            conversations={conversations} 
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="col-span-12 lg:col-span-5 h-full flex flex-col overflow-hidden">
          <ChatInterface 
            conversation={selectedConversation} 
            onSendMessage={handleSendMessage}
            selectedProfessional={selectedProfessional}
          />
        </div>
        <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden">
          <CalendarView 
            professionals={professionals}
            selectedProfessional={selectedProfessional}
            onSelectProfessional={setSelectedProfessionalId}
          />
        </div>
      </div>
    </div>
  );
};

export default AgendaView;
