

import React, { useState } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { FinancialRecord } from '../types';

interface AiCopilotProps {
  data: FinancialRecord[];
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#1B7C75] animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-[#1B7C75] animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-[#1B7C75] animate-bounce"></div>
    </div>
);


const AiCopilot: React.FC<AiCopilotProps> = ({ data, category, dateRange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [error, setError] = useState('');

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError('');
    setInsight('');
    try {
      const result = await getFinancialInsights(data, category, dateRange);
      setInsight(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao obter análise.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#002C3C] p-6 rounded-2xl shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <i className="ph ph-brain text-3xl text-cyan-300"></i>
        <h3 className="font-bold text-lg text-white">Copiloto Financeiro IA</h3>
      </div>
      
      <div className="flex-grow bg-[#004D5A]/50 rounded-lg p-4 overflow-y-auto scrollbar-hide">
        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {insight && (
          <div 
            className="text-white prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3"
            dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br />') }}
          />
        )}
        {!isLoading && !insight && !error && (
            <p className="text-gray-300 text-sm">
                Clique no botão abaixo para obter uma análise e projeção com base nos filtros atuais.
            </p>
        )}
      </div>

      <button
        onClick={handleGetInsights}
        disabled={isLoading}
        className="mt-4 w-full bg-[#1B7C75] hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        <i className="ph ph-sparkle"></i>
        {isLoading ? 'Analisando...' : `Gerar Análise de ${category}`}
      </button>
    </div>
  );
};

export default AiCopilot;