import React, { useState, useMemo } from 'react';
import ChatInterface from '../components/agenda/ChatInterface';
import CalendarView from '../components/agenda/CalendarView';
import ConversationList from '../components/agenda/ConversationList';
import { MOCK_APPOINTMENTS, MOCK_CONVERSATIONS } from '../constants';
import { Appointment, WhatsAppConversation, Message } from '../types';
import { getAgendaResponse } from '../services/agendaService';

const AgendaView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('convo-1');

  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const handleNewAppointment = (newAppointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: `appt-${Date.now()}`,
    };
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
  };

  const handleSendMessage = async (text: string, conversationId: string) => {
    const staffMessage: Message = {
      id: Date.now(),
      text,
      sender: 'staff',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistically update UI
    updateConversation(conversationId, [...(selectedConversation?.messages ?? []), staffMessage]);
    
    // Simulate bot response after staff intervention
    // In a real app, the backend would handle this logic
    const { responseText, appointmentData } = await getAgendaResponse(text, selectedConversation?.messages ?? []);

    if (appointmentData && selectedConversation) {
        handleNewAppointment({ ...appointmentData, patient: selectedConversation.patientName });
    }

    const botMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    updateConversation(conversationId, [...(selectedConversation?.messages ?? []), staffMessage, botMessage]);
  };
  
  const updateConversation = (conversationId: string, newMessages: Message[]) => {
      setConversations(prev => prev.map(c => 
          c.id === conversationId 
          ? { ...c, messages: newMessages, lastMessageSnippet: newMessages[newMessages.length-1].text.substring(0, 40) + '...', lastMessageTimestamp: newMessages[newMessages.length-1].timestamp } 
          : c
      ));
  }


  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-84px)] overflow-hidden">
      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-12 lg:col-span-3 h-full flex flex-col">
          <ConversationList 
            conversations={conversations} 
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="col-span-12 lg:col-span-5 h-full flex flex-col">
          <ChatInterface 
            conversation={selectedConversation} 
            onSendMessage={handleSendMessage}
            onNewAppointment={handleNewAppointment}
          />
        </div>
        <div className="hidden lg:block lg:col-span-4 h-full">
          <CalendarView appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default AgendaView;