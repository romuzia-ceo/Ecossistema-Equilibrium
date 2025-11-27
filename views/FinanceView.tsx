

import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import KpiCard from '../components/KpiCard';
import CostCenterChart from '../components/CostCenterChart';
import DataTable from '../components/DataTable';
import AiCopilot from '../components/AiCopilot';
import AccountsPayable from '../components/finance/AccountsPayable';
import CashFlowChart from '../components/finance/CashFlowChart';
import { getFinancialDashboardData } from '../services/financeService';
import { CostCenterCategory, ChartData, FinancialRecord } from '../types';

interface DynamicFinancials {
    kpis: { 
        totalRevenue: number; 
        totalCosts: number; 
        netProfit: number;
        totalRevenueChange: number;
        totalCostsChange: number;
        netProfitChange: number;
    };
    chartData: ChartData[];
    tableData: FinancialRecord[];
    dateRange: {
        start: string;
        end: string;
    }
}

type FinanceTab = 'dashboard' | 'cashflow' | 'payables';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
            isActive 
            ? 'bg-[#1B7C75] text-white shadow-md' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);

const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<CostCenterCategory>(CostCenterCategory.SPECIALTY);
  const [dateRangeKey, setDateRangeKey] = useState('this_month');
  const [isLoading, setIsLoading] = useState(true);
  const [financialData, setFinancialData] = useState<DynamicFinancials | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getFinancialDashboardData(selectedCategory, dateRangeKey);
      setFinancialData(data);
      setIsLoading(false);
    };
    loadData();
  }, [selectedCategory, dateRangeKey]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  if (isLoading || !financialData) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1B7C75] rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando dados financeiros...</p>
            </div>
        </div>
    );
  }

  const { kpis, chartData, tableData, dateRange } = financialData;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 justify-center sm:justify-start overflow-x-auto pb-2">
          <TabButton label="Dashboard Geral" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <TabButton label="Fluxo de Caixa (Projeção)" isActive={activeTab === 'cashflow'} onClick={() => setActiveTab('cashflow')} />
          <TabButton label="Contas a Pagar" isActive={activeTab === 'payables'} onClick={() => setActiveTab('payables')} />
      </div>

      {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in-up">
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedRange={dateRangeKey}
              onRangeChange={setDateRangeKey}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <KpiCard 
                  title="Receita Total" 
                  value={formatCurrency(kpis.totalRevenue)}
                  icon={<i className="ph ph-chart-line-up text-xl"></i>}
                  color="#1B7C75"
                  percentageChange={kpis.totalRevenueChange}
                  period="vs. período anterior"
                />
                <KpiCard 
                  title="Custos Totais" 
                  value={formatCurrency(kpis.totalCosts)}
                  icon={<i className="ph ph-chart-line-down text-xl"></i>}
                  color="#F97316"
                  percentageChange={kpis.totalCostsChange}
                  positiveChangeIsGood={false}
                   period="vs. período anterior"
                />
                <KpiCard 
                  title="Lucro Líquido" 
                  value={formatCurrency(kpis.netProfit)}
                  icon={<i className="ph ph-scales text-xl"></i>}
                  color="#004D5A"
                  percentageChange={kpis.netProfitChange}
                   period="vs. período anterior"
                />
            </div>
    
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                  <CostCenterChart data={chartData} />
              </div>
              <div className="lg:col-span-1">
                  <AiCopilot data={tableData} category={selectedCategory} dateRange={dateRange} />
              </div>
            </div>
    
            <div>
              <DataTable data={tableData} category={selectedCategory} />
            </div>
          </div>
      )}

      {activeTab === 'cashflow' && (
          <div className="animate-fade-in-up space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
                  <i className="ph-fill ph-info text-blue-600 text-xl mt-0.5"></i>
                  <div>
                      <h4 className="font-bold text-blue-800">Como funciona a projeção?</h4>
                      <p className="text-sm text-blue-700">
                          O gráfico abaixo combina seu saldo atual com: <br/>
                          1. <strong>Entradas Previstas:</strong> Agendamentos futuros na agenda clínica.<br/>
                          2. <strong>Saídas Previstas:</strong> Contas registradas no módulo "Contas a Pagar".
                      </p>
                  </div>
              </div>
              <CashFlowChart />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <AccountsPayable /> {/* Show concise version here or just let user go to tab? Let's show full table here too for context or just summary */}
                   {/* Reusing the Copilot here for cash flow analysis would be great in future iterations */}
                   <div className="bg-[#002C3C] p-6 rounded-2xl shadow-md text-white">
                        <h3 className="font-bold text-lg mb-2"><i className="ph ph-trend-up mr-2"></i>Dica Financeira</h3>
                        <p className="text-gray-300 text-sm">
                            Mantenha suas contas a pagar e a agenda de atendimentos sempre atualizadas para garantir que o gráfico de fluxo de caixa reflita a realidade da sua clínica com precisão.
                        </p>
                   </div>
              </div>
          </div>
      )}

      {activeTab === 'payables' && (
          <div className="animate-fade-in-up">
              <AccountsPayable />
          </div>
      )}

    </div>
  );
};

export default FinanceView;