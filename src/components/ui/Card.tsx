import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-dark-surface border border-dark-border rounded-lg p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface KPITileProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number | string;
  unit?: string;
  borderColor?: 'green' | 'blue' | 'purple' | 'orange';
  icon?: string;
  children?: React.ReactNode;
}

const borderColorMap = {
  green: 'border-eco-green',
  blue: 'border-eco-blue',
  purple: 'border-eco-purple',
  orange: 'border-eco-orange',
};

export const KPITile: React.FC<KPITileProps> = ({
  title,
  value,
  unit = '',
  borderColor = 'blue',
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-dark-surface border-l-4 rounded-lg p-6',
        borderColorMap[borderColor],
        className
      )}
      {...props}
    >
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <div className="flex items-baseline">
        <span className={clsx('text-3xl font-bold', {
          'text-eco-green': borderColor === 'green',
          'text-eco-blue': borderColor === 'blue',
          'text-eco-purple': borderColor === 'purple',
          'text-eco-orange': borderColor === 'orange',
        })}>
          {value}
        </span>
        {unit && <span className="text-slate-400 ml-2">{unit}</span>}
      </div>
      {children}
    </div>
  );
};

export default Card;
