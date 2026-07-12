'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/ProgressBar';
import { Input, SearchBox } from '@/components/ui/Badge';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('builder');

  const tabs = [
    { label: 'Environmental', value: 'env', icon: '🌱' },
    { label: 'Social', value: 'social', icon: '👥' },
    { label: 'Governance', value: 'gov', icon: '⚖️' },
    { label: 'ESG Summary', value: 'summary', icon: '📊' },
    { label: 'Custom Builder', value: 'builder', icon: '🔨' },
  ];

  const reportTemplates = [
    {
      id: '1',
      name: 'Environmental Report',
      description: 'Detailed emissions tracking and sustainability metrics',
      icon: '🌱',
    },
    {
      id: '2',
      name: 'Social Report',
      description: 'CSR activities and employee engagement metrics',
      icon: '👥',
    },
    {
      id: '3',
      name: 'Governance Report',
      description: 'Compliance and audit findings',
      icon: '⚖️',
    },
    {
      id: '4',
      name: 'ESG Summary Report',
      description: 'Comprehensive ESG overview and trends',
      icon: '📊',
    },
  ];

  return (
    <>
      <TopBar title="Reports" />
      <div className="p-8 bg-dark-primary min-h-screen">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'builder' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 flex-grow">{template.description}</p>
                  <Button variant="primary" size="sm">
                    Generate
                  </Button>
                </Card>
              ))}
            </div>

            <Card>
              <h2 className="text-xl font-bold text-slate-100 mb-6">Custom Report Builder: Filters</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Date Range
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-slate-100">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Department
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-slate-100">
                    <option>All</option>
                    <option>Manufacturing</option>
                    <option>Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Module
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-slate-100">
                    <option>All</option>
                    <option>Environmental</option>
                    <option>Social</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Employee
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-slate-100">
                    <option>All</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Challenge
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-slate-100">
                    <option>All</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    ESG Category
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-slate-100">
                    <option>All</option>
                    <option>Environmental</option>
                    <option>Social</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Run Report</Button>
                <Button variant="ghost">Export: PDF</Button>
                <Button variant="ghost">Export: Excel</Button>
                <Button variant="ghost">Export: CSV</Button>
              </div>
            </Card>
          </>
        )}

        {activeTab !== 'builder' && (
          <Card>
            <p className="text-slate-400">{tabs.find(t => t.value === activeTab)?.label} report details coming soon...</p>
          </Card>
        )}
      </div>
    </>
  );
}
