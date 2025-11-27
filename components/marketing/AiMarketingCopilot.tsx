import React, { useState } from 'react';
import { getMarketingPlan, getSocialMediaPostsForCampaign } from '../../services/marketingAiService';
import { MarketingMetrics } from '../../types';

interface AiMarketingCopilotProps {
  metrics: MarketingMetrics;
  activeCampaign?: { name: string };
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#6D28D9] animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-[#6D28D9] animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-[#6D28D9] animate-bounce"></div>
    </div>
);


const AiMarketingCopilot: React.FC<AiMarketingCopilotProps> = ({ metrics, activeCampaign }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const [error, setError] = useState('');

  const handleGetPlan = async (type: 'general' | 'social') => {
    setIsLoading(true);
    setError('');
    setPlan('');
    try {
      let result;
      if (type === 'social' && activeCampaign) {
          result = await getSocialMediaPostsForCampaign(activeCampaign.name);
      } else {
          result = await getMarketingPlan(metrics);
      }
      setPlan(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao obter plano de marketing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#002C3C] p-6 rounded-2xl shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <i className="ph ph-rocket-launch text-3xl text-purple-300"></i>
        <h3 className="font-bold text-lg text-white">Copiloto de Marketing IA</h3>
      </div>
      
      <div className="flex-grow bg-[#004D5A]/50 rounded-lg p-4 overflow-y-auto scrollbar-hide">
        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {plan && (
          <div 
            className="text-white prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3"
            dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br />') }}
          />
        )}
        {!isLoading && !plan && !error && (
            <p className="text-gray-300 text-sm">
                Clique em um dos botões abaixo para que a IA analise os dados e gere um plano de ação de marketing inteligente.
            </p>
        )}
      </div>

      <div className="mt-4 w-full flex flex-col sm:flex-row gap-2">
        <button
            onClick={() => handleGetPlan('general')}
            disabled={isLoading}
            className="flex-1 bg-[#6D28D9] hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            <i className="ph ph-sparkle"></i>
            {isLoading ? 'Analisando...' : 'Gerar Plano Estratégico'}
        </button>
        {activeCampaign && (
             <button
                onClick={() => handleGetPlan('social')}
                disabled={isLoading}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                <i className="ph ph-instagram-logo"></i>
                {isLoading ? 'Criando...' : `Criar Posts para ${activeCampaign.name}`}
            </button>
        )}
      </div>
    </div>
  );
};

export default AiMarketingCopilot;