import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, gradient }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center justify-center w-14 h-14 bg-linear-to-br ${gradient} rounded-2xl shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="text-4xl font-black text-gray-900 mb-2">{value}</div>
      <div className="text-sm font-semibold text-gray-600">{title}</div>
    </div>
  );
};

export default StatCard;