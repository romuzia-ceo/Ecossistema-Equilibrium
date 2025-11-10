import React, { useState, useRef, useEffect } from 'react';
import { Message, Appointment, WhatsAppConversation } from '../../types';
import { getAgendaResponse } from '../../services/agendaService';

interface ChatInterfaceProps {
    conversation: WhatsAppConversation | undefined;
    onSendMessage: (text: string, conversationId: string) => void;
    onNewAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversation, onSendMessage, onNewAppointment }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversation) return;
    
    setIsLoading(true);
    await onSendMessage(inputValue, conversation.id);
    setInputValue('');
    setIsLoading(false);
  };
  
  if (!conversation) {
    return (
        <div className="bg-white rounded-2xl shadow-md flex flex-col h-full items-center justify-center text-center p-4">
            <i className="ph-bold ph-chats-circle text-6xl text-gray-300 mb-4"></i>
            <h3 className="font-bold text-lg text-[#002C3C]">Selecione uma conversa</h3>
            <p className="text-gray-500">Escolha uma conversa da lista para ver o histórico de mensagens.</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
         <div className="w-11 h-11 bg-[#1B7C75] rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {conversation.patientName.charAt(0)}
         </div>
         <div>
            <h3 className="font-bold text-[#002C3C]">{conversation.patientName}</h3>
            <p className="text-xs text-gray-500 font-medium">{conversation.patientPhone}</p>
         </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50/50 scrollbar-hide">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'} mb-4`}>
             <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.sender === 'patient' ? 'bg-[#005C4B] text-white rounded-br-lg' : 
                msg.sender === 'bot' ? 'bg-gray-200 text-[#002C3C] rounded-bl-lg' :
                'bg-blue-100 border border-blue-200 text-blue-900 rounded-bl-lg'
              }`}
            >
              {msg.sender === 'staff' && <p className="text-xs font-bold text-blue-800 mb-1">Carla (Recepção)</p>}
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'patient' ? 'text-gray-300' : 'text-gray-500'} text-right`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start mb-4">
                 <div className="bg-gray-200 text-[#002C3C] rounded-bl-lg px-4 py-3 rounded-2xl">
                     <div className="flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-center text-gray-500 mb-2 font-semibold">Intervenção Manual (Equipe da Clínica)</p>
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Responder como membro da equipe..."
            className="flex-grow bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-[#1B7C75] focus:border-[#1B7C75] block w-full p-2.5 px-4"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#1B7C75] hover:bg-[#004D5A] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <i className="ph-bold ph-paper-plane-right text-xl"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;