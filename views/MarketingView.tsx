import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import PopularityChart from '../components/marketing/PopularityChart';
import AiMarketingCopilot from '../components/marketing/AiMarketingCopilot';
import { MarketingMetrics, View } from '../types';
import { getMarketingDashboardData } from '../services/marketingService';
import { HEALTH_CAMPAIGNS } from '../constants';

// Re-using ShortcutCard from HomeView for consistency
const ShortcutCard: React.FC<{ title: string; icon: string; onClick: () => void; }> = ({ title, icon, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-2xl shadow-md text-center hover:bg-teal-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
        <i className={`ph-bold ph-${icon} text-4xl text-[#1B7C75] mb-2`}></i>
        <p className="font-semibold text-[#002C3C]">{title}</p>
    </button>
);

interface MarketingViewProps {
    setActiveView: (view: View) => void;
}

const MarketingView: React.FC<MarketingViewProps> = ({ setActiveView }) => {
    const [metrics, setMetrics] = useState<MarketingMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await getMarketingDashboardData();
            setMetrics(data);
            setIsLoading(false);
        };
        loadData();
    }, []);
    
    // Determine the active campaign for the current month
    const currentMonth = new Date().getMonth();
    const activeCampaign = HEALTH_CAMPAIGNS[currentMonth];

    if (isLoading || !metrics) {
        return <div className="text-center p-8">Carregando dados de marketing...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <KpiCard 
                      title="Profissional Destaque" 
                      value={metrics.topProfessional.name}
                      icon={<i className="ph ph-user-star text-xl"></i>}
                      color="#6D28D9" // Deep purple
                    />
                    <KpiCard 
                      title="Serviço Mais Procurado" 
                      value={metrics.topService.name}
                      icon={<i className="ph ph-first-aid-kit text-xl"></i>}
                      color="#DB2777" // Fuchsia
                    />
                    <KpiCard 
                      title="Satisfação (NPS)" 
                      value={`${metrics.satisfactionRate}%`}
                      icon={<i className="ph ph-smiley text-xl"></i>}
                      color="#1B7C75" // Teal
                      percentageChange={1.5}
                    />
                    <KpiCard 
                      title="Novos Pacientes (Mês)" 
                      value={String(metrics.newPatients)}
                      icon={<i className="ph ph-user-plus text-xl"></i>}
                      color="#F97316" // Orange
                      percentageChange={8.3}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-[#002C3C] mt-8 mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                       <ShortcutCard title="Editar Conteúdo do Site" icon="browser" onClick={() => setActiveView('management')} />
                       {/* Outros atalhos de marketing poderiam ser adicionados aqui */}
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-1">
                        <PopularityChart data={metrics.professionalPopularity} />
                    </div>
                    <div className="lg:col-span-2">
                        <AiMarketingCopilot metrics={metrics} activeCampaign={activeCampaign} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MarketingView;