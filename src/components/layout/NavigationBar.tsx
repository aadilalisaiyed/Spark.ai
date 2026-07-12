'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface NavTab {
  label: string;
  href: string;
  color: 'gray' | 'green' | 'blue' | 'purple' | 'orange';
}

const tabs: NavTab[] = [
  { label: 'Dashboard', href: '/', color: 'gray' },
  { label: 'Environmental', href: '/environmental', color: 'green' },
  { label: 'Social', href: '/social', color: 'blue' },
  { label: 'Governance', href: '/governance', color: 'purple' },
  { label: 'Gamification', href: '/gamification', color: 'orange' },
  { label: 'Reports', href: '/reports', color: 'gray' },
  { label: 'Settings', href: '/settings', color: 'gray' },
];

const colorMap = {
  gray: 'text-gray-400 hover:text-gray-200 data-[active=true]:text-white data-[active=true]:border-b-2 data-[active=true]:border-gray-400',
  green: 'text-slate-400 hover:text-slate-200 data-[active=true]:text-eco-green data-[active=true]:border-b-2 data-[active=true]:border-eco-green',
  blue: 'text-slate-400 hover:text-slate-200 data-[active=true]:text-eco-blue data-[active=true]:border-b-2 data-[active=true]:border-eco-blue',
  purple: 'text-slate-400 hover:text-slate-200 data-[active=true]:text-eco-purple data-[active=true]:border-b-2 data-[active=true]:border-eco-purple',
  orange: 'text-slate-400 hover:text-slate-200 data-[active=true]:text-eco-orange data-[active=true]:border-b-2 data-[active=true]:border-eco-orange',
};

export const NavigationBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-dark-surface border-b border-dark-border px-8 py-0 flex gap-8">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (pathname === '/' && tab.href === '/');
        return (
          <Link
            key={tab.href}
            href={tab.href}
            data-active={isActive}
            className={clsx(
              'px-2 py-4 font-medium text-sm transition-colors duration-200',
              colorMap[tab.color]
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationBar;
