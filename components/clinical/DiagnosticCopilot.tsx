import React, { useState } from 'react';
import { getDiagnosticAssistance } from '../../services/clinicalAiService';

interface DiagnosticCopilotProps {
  notes: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
    </div>
);


const DiagnosticCopilot: React.FC<DiagnosticCopilotProps> = ({ notes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');

  const handleGetAnalysis = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis('');
    try {
      const result = await getDiagnosticAssistance(notes);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao obter análise.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#002C3C] p-4 rounded-xl shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <i className="ph ph-brain text-2xl text-cyan-300"></i>
        <h3 className="font-bold text-lg text-white">Co-piloto Clínico</h3>
      </div>
      
      <div className="flex-grow bg-[#004D5A]/50 rounded-lg p-3 overflow-y-auto scrollbar-hide text-sm">
        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {analysis && (
          <div 
            className="text-white prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1"
            dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }}
          />
        )}
        {!isLoading && !analysis && !error && (
            <p className="text-gray-300 text-xs text-center pt-4">
                Preencha as anotações clínicas e clique no botão abaixo para receber sugestões de suporte à decisão.
            </p>
        )}
      </div>

      <button
        onClick={handleGetAnalysis}
        disabled={isLoading || !notes.trim()}
        className="mt-3 w-full bg-[#1B7C75] hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
      >
        <i className="ph ph-sparkle"></i>
        {isLoading ? 'Analisando...' : 'Analisar Anotações'}
      </button>
    </div>
  );
};

export default DiagnosticCopilot;
