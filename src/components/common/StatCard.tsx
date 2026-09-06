import React from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    percentage: number;
    isPositive: boolean; // whether the trend is financially positive (e.g. higher savings = positive, higher expense = negative)
    label?: string;
  };
  icon: React.ReactNode;
  variant?: 'default' | 'indigo' | 'mint' | 'amber' | 'coral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  onClick
}) => {
  const iconBgClasses = {
    default: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400',
    indigo: 'bg-indigo-500/10 text-fintwin-indigo dark:bg-indigo-500/20 dark:text-indigo-300',
    mint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
    coral: 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
  }[variant];

  return (
    <Card 
      className={`p-5 relative overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform duration-200`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${iconBgClasses}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {trend && (
          <div className={`flex items-center font-medium gap-1 ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {trend.percentage >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.percentage)}%</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              {trend.label || 'vs last month'}
            </span>
          </div>
        )}
        {subtitle && (
          <span className="text-slate-500 dark:text-slate-400 text-xs truncate max-w-[180px]">
            {subtitle}
          </span>
        )}
      </div>
    </Card>
  );
};

interface AlertBannerProps {
  title: string;
  description: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  description,
  variant = 'warning',
  actionLabel,
  onAction,
  onDismiss
}) => {
  const bgClasses = {
    danger: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/60 dark:border-rose-900/60 dark:text-rose-200',
    warning: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/60 dark:border-amber-900/60 dark:text-amber-200',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-900/60 dark:text-indigo-200',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-900/60 dark:text-emerald-200'
  }[variant];

  return (
    <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm ${bgClasses} animate-fade-slide-up`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/90 dark:bg-slate-900/80 shadow-sm hover:bg-white text-current transition-colors"
          >
            {actionLabel}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
