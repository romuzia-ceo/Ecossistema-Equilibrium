import React, { useState, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import KpiCard from '../components/KpiCard';
import CostCenterChart from '../components/CostCenterChart';
import DataTable from '../components/DataTable';
import AiCopilot from '../components/AiCopilot';
import { MOCK_FINANCIAL_DATA } from '../constants';
import { CostCenterCategory, ChartData } from '../types';

const FinanceView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CostCenterCategory>(CostCenterCategory.SPECIALTY);

  const filteredData = useMemo(() => {
    return MOCK_FINANCIAL_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const { totalRevenue, totalCosts, netProfit } = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.totalRevenue += item.revenue;
        acc.totalCosts += item.costs;
        acc.netProfit += item.revenue - item.costs;
        return acc;
      },
      { totalRevenue: 0, totalCosts: 0, netProfit: 0 }
    );
  }, [filteredData]);

  const chartData: ChartData[] = useMemo(() => {
    return filteredData.map((item) => ({
      name: item.name,
      receita: item.revenue,
      custos: item.costs,
      lucro: item.revenue - item.costs,
    }));
  }, [filteredData]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <KpiCard 
              title="Receita Total" 
              value={formatCurrency(totalRevenue)}
              icon={<i className="ph ph-chart-line-up text-xl"></i>}
              color="#1B7C75"
              percentageChange={5.2}
              period="vs. último mês"
            />
            <KpiCard 
              title="Custos Totais" 
              value={formatCurrency(totalCosts)}
              icon={<i className="ph ph-chart-line-down text-xl"></i>}
              color="#F97316"
              percentageChange={-2.1}
              positiveChangeIsGood={false}
              period="vs. último mês"
            />
            <KpiCard 
              title="Lucro Líquido" 
              value={formatCurrency(netProfit)}
              icon={<i className="ph ph-scales text-xl"></i>}
              color="#004D5A"
              percentageChange={12.8}
              period="vs. último mês"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <CostCenterChart data={chartData} />
          </div>
          <div className="lg:col-span-1">
              <AiCopilot data={filteredData} category={selectedCategory} />
          </div>
        </div>

        <div>
          <DataTable data={filteredData} category={selectedCategory} />
        </div>

      </div>
    </div>
  );
};

export default FinanceView;