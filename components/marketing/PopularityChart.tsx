import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PopularityChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#1B7C75', '#004D5A', '#F97316', '#6D28D9', '#DB2777'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-[#002C3C]">{`${data.name}: ${data.value} atendimentos`}</p>
      </div>
    );
  }
  return null;
};

const PopularityChart: React.FC<PopularityChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-full">
      <h3 className="font-bold text-lg text-[#002C3C] mb-4">Popularidade por Profissional</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularityChart;
