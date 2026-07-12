import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
}

const variantColors = {
  success: 'bg-green-900 text-green-200 border border-green-700',
  warning: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
  error: 'bg-red-900 text-red-200 border border-red-700',
  info: 'bg-blue-900 text-blue-200 border border-blue-700',
  default: 'bg-slate-700 text-slate-200 border border-slate-600',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={clsx(
        'inline-block px-3 py-1 rounded-full text-sm font-medium',
        variantColors[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2',
          'text-slate-100 placeholder-slate-500 focus:outline-none focus:border-eco-blue',
          'transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, className, ...props }) => {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search..."
        onChange={(e) => onSearch?.(e.target.value)}
        className={clsx(
          'w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2',
          'text-slate-100 placeholder-slate-500 focus:outline-none focus:border-eco-blue',
          'transition-colors',
          className
        )}
        {...props}
      />
      <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
    </div>
  );
};

export default Badge;
