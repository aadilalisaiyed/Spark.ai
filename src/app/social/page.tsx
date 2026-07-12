'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { mockCSRActivities, mockActivityParticipations } from '@/lib/api';

export default function Social() {
  const [activeTab, setActiveTab] = useState('activities');
  const [activities] = useState(mockCSRActivities);
  const [participations] = useState(mockActivityParticipations);

  const tabs = [
    { label: 'CSR Activities', value: 'activities', icon: '🌱' },
    { label: 'Employee Participation', value: 'participation', icon: '👥' },
    { label: 'Diversity Dashboard', value: 'diversity', icon: '🌍' },
  ];

  return (
    <>
      <TopBar title="Social" />
      <div className="p-8 bg-dark-primary min-h-screen">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'activities' && (
          <>
            <div className="mb-6">
              <Button variant="primary" size="md">
                + New Activity
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.id} className="flex flex-col">
                  <div className="text-4xl mb-3">{activity.icon}</div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{activity.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{activity.participantCount} joined</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="info">{activity.status}</Badge>
                    <span className="text-sm text-eco-orange">{activity.points} pts</span>
                  </div>
                  <Button variant="primary" size="sm" className="mt-auto">
                    Join Activity
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'participation' && (
          <Card>
            <h2 className="text-xl font-bold text-slate-100 mb-6">Approval Queue</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-surface">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Employee</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Activity</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Proof</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Points</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participations.map((p) => (
                    <tr key={p.id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="px-4 py-3 text-slate-100">{p.employeeName}</td>
                      <td className="px-4 py-3 text-slate-100">{p.activityTitle}</td>
                      <td className="px-4 py-3 text-slate-100">{p.proof}</td>
                      <td className="px-4 py-3 text-slate-100">{p.points}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            p.status === 'Pending'
                              ? 'warning'
                              : p.status === 'Approved'
                              ? 'success'
                              : 'error'
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="primary">Approve</Button>
              <Button variant="danger">Reject</Button>
            </div>
          </Card>
        )}

        {activeTab === 'diversity' && (
          <Card>
            <p className="text-slate-400">Diversity Dashboard coming soon...</p>
          </Card>
        )}
      </div>
    </>
  );
}
