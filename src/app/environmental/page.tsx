'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/ProgressBar';
import { SearchBox, Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockEmissionGoals } from '@/lib/api';
import { EmissionData } from '@/types';

export default function Environmental() {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals] = useState(mockEmissionGoals);

  const tabs = [
    { label: 'Emission Factors', value: 'factors', icon: '📈' },
    { label: 'Product ESG', value: 'products', icon: '📦' },
    { label: 'Carbon Transactions', value: 'transactions', icon: '💱' },
    { label: 'Environmental Goals', value: 'goals', icon: '🎯' },
  ];

  return (
    <>
      <TopBar title="Environmental" />
      <div className="p-8 bg-dark-primary min-h-screen">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'goals' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Environmental Goals</h2>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  + New Goal
                </Button>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
                <Button variant="ghost" size="sm">
                  Export
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <SearchBox placeholder="Search goals..." />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-surface">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Target CO₂</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Current CO₂</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Progress</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Deadline</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((goal) => (
                    <tr
                      key={goal.id}
                      className="border-b border-dark-border hover:bg-dark-surface transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-100">{goal.name}</td>
                      <td className="px-4 py-3 text-slate-100">{goal.department}</td>
                      <td className="px-4 py-3 text-slate-100">{goal.targetCO2} t</td>
                      <td className="px-4 py-3 text-slate-100">{goal.currentCO2} t</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={goal.progress} max={100} />
                          <span className="text-sm text-slate-400">{goal.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-100">{goal.deadline}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">{goal.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab !== 'goals' && (
          <Card>
            <p className="text-slate-400">Content for {tabs.find(t => t.value === activeTab)?.label} coming soon...</p>
          </Card>
        )}
      </div>
    </>
  );
}
