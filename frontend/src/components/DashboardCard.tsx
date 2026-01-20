import { type LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

export default function DashboardCard({ title, value, Icon, subtitle, trend, gradient = 'from-primary-300 to-secondary-200' }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 hover:shadow-xl transition-all duration-300 border border-primary-100 hover:border-primary-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 truncate uppercase tracking-wide">{title}</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 truncate mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-3 text-xs sm:text-sm font-semibold ${trend.isPositive ? 'text-secondary-200' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
        </div>
      </div>
    </div>
  );
}
