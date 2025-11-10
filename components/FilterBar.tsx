
import React from 'react';
import { CostCenterCategory } from '../types';

interface FilterBarProps {
  selectedCategory: CostCenterCategory;
  onCategoryChange: (category: CostCenterCategory) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label htmlFor="cost-center" className="font-semibold text-[#002C3C] whitespace-nowrap">
          Analisar por:
        </label>
        <select
          id="cost-center"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as CostCenterCategory)}
          className="w-full sm:w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#1B7C75] focus:border-[#1B7C75] block p-2.5 transition-colors"
        >
          {Object.values(CostCenterCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
