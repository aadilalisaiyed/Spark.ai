import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: 'success' | 'warning' | 'error' | 'info';
  label?: string;
  animated?: boolean;
}

const variantColors = {
  success: 'bg-eco-green',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
  info: 'bg-eco-blue',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'info',
  label,
  animated = true,
}) => {
  const percentage = (value / max) * 100;

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-sm text-slate-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-dark-surface rounded-full h-2 overflow-hidden border border-dark-border">
        <div
          className={clsx(
            'h-full transition-all duration-300 rounded-full',
            variantColors[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

interface TabsProps {
  tabs: Array<{ label: string; value: string; icon?: string }>;
  activeTab: string;
  onTabChange: (value: string) => void;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
}) => {
  return (
    <div className={clsx('flex gap-2', variant === 'underline' && 'border-b border-dark-border')}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={clsx(
            'px-4 py-2 font-medium text-sm transition-colors duration-200 rounded-lg flex items-center gap-2',
            activeTab === tab.value
              ? 'bg-eco-blue text-white'
              : 'text-slate-400 hover:text-slate-200 bg-transparent'
          )}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface StatusFlowProps {
  stages: Array<{ label: string; status: 'completed' | 'active' | 'pending' }>;
}

export const StatusFlow: React.FC<StatusFlowProps> = ({ stages }) => {
  const statusColors = {
    completed: 'bg-eco-green',
    active: 'bg-eco-blue',
    pending: 'bg-dark-surface border border-dark-border',
  };

  const statusTextColors = {
    completed: 'text-eco-green',
    active: 'text-eco-blue',
    pending: 'text-slate-400',
  };

  return (
    <div className="flex items-center justify-between">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.label}>
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                statusColors[stage.status],
                stage.status === 'pending' && 'text-slate-400'
              )}
            >
              {stage.status === 'completed' ? '✓' : index + 1}
            </div>
            <span className={clsx('text-xs font-medium mt-2', statusTextColors[stage.status])}>
              {stage.label}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div
              className={clsx(
                'flex-1 h-1 mx-2',
                stage.status === 'completed' ? 'bg-eco-green' : 'bg-dark-border'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
