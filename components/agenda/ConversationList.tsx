import React from 'react';
import { WhatsAppConversation } from '../../types';

interface ConversationListProps {
  conversations: WhatsAppConversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationItem: React.FC<{
    convo: WhatsAppConversation;
    isSelected: boolean;
    onClick: () => void;
}> = ({ convo, isSelected, onClick }) => (
    <li
        onClick={onClick}
        className={`
            flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-colors
            ${isSelected ? 'bg-[#004D5A]/10' : 'hover:bg-gray-100'}
        `}
    >
        <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-[#1B7C75] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {convo.patientName.charAt(0)}
            </div>
            {convo.unreadCount > 0 && (
                 <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold text-center ring-2 ring-white">
                    {convo.unreadCount}
                </span>
            )}
        </div>
        <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
                <p className={`font-bold text-sm truncate ${isSelected ? 'text-[#002C3C]' : 'text-gray-800'}`}>
                    {convo.patientName}
                </p>
                <p className={`text-xs flex-shrink-0 ${isSelected ? 'text-[#004D5A]' : 'text-gray-500'}`}>
                    {convo.lastMessageTimestamp}
                </p>
            </div>
            <p className="text-xs text-gray-500 truncate mt-1">
                {convo.lastMessageSnippet}
            </p>
        </div>
    </li>
);

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedConversationId, onSelectConversation }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-full flex flex-col">
      <h3 className="font-bold text-lg text-[#002C3C] mb-4 px-2">Conversas Ativas</h3>
      <div className="flex-grow overflow-y-auto scrollbar-hide -mr-2 pr-2">
        <ul className="space-y-1">
          {conversations.map(convo => (
            <ConversationItem 
                key={convo.id}
                convo={convo}
                isSelected={selectedConversationId === convo.id}
                onClick={() => onSelectConversation(convo.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConversationList;
