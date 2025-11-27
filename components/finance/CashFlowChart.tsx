import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { CashFlowPoint } from '../../types';
import { getCashFlowProjection } from '../../services/financeService';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-[#002C3C] mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }}></div>
            <span className="text-gray-600 capitalize">{pld.name}:</span>
            <span className="font-semibold">
                {pld.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CashFlowChart: React.FC = () => {
    const [data, setData] = useState<CashFlowPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const projection = await getCashFlowProjection(30);
            setData(projection);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) return <div className="p-8 text-center">Calculando projeções...</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md h-96">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-[#002C3C]">Fluxo de Caixa Projetado (30 Dias)</h3>
                    <p className="text-sm text-gray-500">Baseado em agendamentos futuros e contas a pagar registradas.</p>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1B7C75" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1B7C75" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} tickMargin={10} />
                    <YAxis 
                        tickFormatter={(value) => `R$${value/1000}k`} 
                        tick={{ fontSize: 11 }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    
                    {/* Projected Income (Positive Bars) */}
                    <Area 
                        type="monotone" 
                        dataKey="projectedIncome" 
                        name="Receita Prevista" 
                        fill="#10B981" 
                        stroke="none" 
                        fillOpacity={0.3} 
                        stackId="1"
                    />
                    
                    {/* Projected Expense (Negative-ish visuals, but here shown as stacked area for comparison) */}
                    <Area 
                        type="monotone" 
                        dataKey="projectedExpense" 
                        name="Despesa Prevista" 
                        fill="#EF4444" 
                        stroke="none" 
                        fillOpacity={0.3} 
                        stackId="2"
                    />

                    {/* Running Balance Line */}
                    <Line 
                        type="monotone" 
                        dataKey="accumulatedBalance" 
                        name="Saldo Projetado" 
                        stroke="#004D5A" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CashFlowChart;