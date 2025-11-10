
import React from 'react';
import { FinancialRecord } from '../types';

interface DataTableProps {
  data: FinancialRecord[];
  category: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, category }) => {
    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
       <h3 className="font-bold text-lg text-[#002C3C] mb-4">Detalhamento por {category}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-[#004D5A] uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">{category}</th>
                        <th scope="col" className="px-6 py-3 text-right">Receita</th>
                        <th scope="col" className="px-6 py-3 text-right">Custos</th>
                        <th scope="col" className="px-6 py-3 text-right">Lucro</th>
                        <th scope="col" className="px-6 py-3 text-right">Margem</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const profit = item.revenue - item.costs;
                        const margin = item.revenue > 0 ? (profit / item.revenue) * 100 : 0;
                        return (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.name}
                                </th>
                                <td className="px-6 py-4 text-right text-green-600">{formatCurrency(item.revenue)}</td>
                                <td className="px-6 py-4 text-right text-red-600">{formatCurrency(item.costs)}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${profit >= 0 ? 'text-blue-800' : 'text-red-700'}`}>{formatCurrency(profit)}</td>
                                <td className={`px-6 py-4 text-right font-medium ${margin >= 0 ? 'text-gray-700' : 'text-red-700'}`}>{margin.toFixed(1)}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default DataTable;
