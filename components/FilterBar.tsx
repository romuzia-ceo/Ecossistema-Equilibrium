

import React from 'react';
import { CostCenterCategory } from '../types';

interface FilterBarProps {
  selectedCategory: CostCenterCategory;
  onCategoryChange: (category: CostCenterCategory) => void;
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedCategory, onCategoryChange, selectedRange, onRangeChange }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="cost-center" className="font-semibold text-[#002C3C] whitespace-nowrap">
            Analisar por:
            </label>
            <select
            id="cost-center"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as CostCenterCategory)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75] block p-2.5 transition-colors"
            >
            {Object.values(CostCenterCategory).map((category) => (
                <option key={category} value={category}>
                {category}
                </option>
            ))}
            </select>
        </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="date-range" className="font-semibold text-[#002C3C] whitespace-nowrap">
            Período:
            </label>
            <select
            id="date-range"
            value={selectedRange}
            onChange={(e) => onRangeChange(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75] block p-2.5 transition-colors"
            >
                <option value="last7">Últimos 7 dias</option>
                <option value="last30">Últimos 30 dias</option>
                <option value="this_month">Este Mês</option>
                <option value="this_year">Este Ano</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;