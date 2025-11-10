import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  percentageChange?: number;
  period?: string;
  positiveChangeIsGood?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color,
  percentageChange,
  period = 'vs. período anterior',
  positiveChangeIsGood = true,
}) => {
  const hasChange = typeof percentageChange === 'number';
  const isPositive = hasChange && percentageChange >= 0;

  let changeColor = '';
  if (hasChange) {
    const isGoodChange = (isPositive && positiveChangeIsGood) || (!isPositive && !positiveChangeIsGood);
    changeColor = isGoodChange ? 'text-green-600' : 'text-red-600';
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-start gap-4 transition-transform hover:scale-105">
      <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-[#002C3C] mt-1">{value}</p>
        {hasChange && (
          <div className={`flex items-center text-xs font-semibold mt-1 ${changeColor}`}>
            {isPositive ? (
              <i className="ph-bold ph-arrow-up-right mr-1"></i>
            ) : (
              <i className="ph-bold ph-arrow-down-right mr-1"></i>
            )}
            <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            <span className="text-gray-400 font-normal ml-1">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
