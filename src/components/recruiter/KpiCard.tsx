import React from 'react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendPositive?: boolean;
  colorVariant?: 'primary' | 'secondary' | 'accent';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendPositive = true,
  colorVariant = 'primary'
}) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:shadow-lift transition-all flex flex-col justify-between gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            colorVariant === 'secondary'
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-primary-container/10 text-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>

      <div className="text-3xl font-extrabold text-primary tracking-tight">{value}</div>

      {trend && (
        <div
          className={`text-xs font-semibold flex items-center gap-1 ${
            trendPositive ? 'text-secondary' : 'text-error'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {trendPositive ? 'trending_up' : 'trending_down'}
          </span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
