import React from 'react';
import { clsx } from 'clsx';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard' }) => {
  return (
    <div className="bg-dark-surface border-b border-dark-border px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-100">EcoSphere: {title}</h1>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <div className="w-4 h-4 bg-eco-green rounded"></div>
        </div>
      </div>
      <div className="text-slate-400 text-sm">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    </div>
  );
};

export default TopBar;
