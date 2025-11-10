
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface CostCenterChartProps {
  data: ChartData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-[#002C3C]">{label}</p>
        {payload.map((pld: any) => (
          <p key={pld.dataKey} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CostCenterChart: React.FC<CostCenterChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-96">
      <h3 className="font-bold text-lg text-[#002C3C] mb-4">Análise Consolidada</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ bottom: 0 }} />
          <Bar dataKey="receita" fill="#1B7C75" name="Receita" radius={[4, 4, 0, 0]} />
          <Bar dataKey="custos" fill="#F97316" name="Custos" radius={[4, 4, 0, 0]} />
          <Bar dataKey="lucro" fill="#004D5A" name="Lucro" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostCenterChart;
