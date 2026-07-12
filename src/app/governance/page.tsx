'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { mockAudits, mockComplianceIssues } from '@/lib/api';

export default function Governance() {
  const [activeTab, setActiveTab] = useState('audits');
  const [audits] = useState(mockAudits);
  const [issues] = useState(mockComplianceIssues);

  const tabs = [
    { label: 'Policies', value: 'policies', icon: '📋' },
    { label: 'Acknowledgements', value: 'ack', icon: '✓' },
    { label: 'Audits', value: 'audits', icon: '🔍' },
    { label: 'Compliance Issues', value: 'issues', icon: '⚠️' },
  ];

  return (
    <>
      <TopBar title="Governance" />
      <div className="p-8 bg-dark-primary min-h-screen">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'audits' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Audits</h2>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  + New Audit
                </Button>
                <Button variant="ghost" size="sm">
                  Export
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-surface">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Auditor</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Findings</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => (
                    <tr key={audit.id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="px-4 py-3 text-slate-100">{audit.title}</td>
                      <td className="px-4 py-3 text-slate-100">{audit.department}</td>
                      <td className="px-4 py-3 text-slate-100">{audit.auditor}</td>
                      <td className="px-4 py-3 text-slate-100">{audit.date}</td>
                      <td className="px-4 py-3 text-slate-100">{audit.findings}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">{audit.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'issues' && (
          <Card>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Compliance Issues</h2>
            <p className="text-slate-400 text-sm mb-6">Compliance Issues raised from Audits — severity-tagged, resolution tracked</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-surface">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Issue</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Severity</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="px-4 py-3 text-slate-100">{issue.issue}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            issue.severity === 'High'
                              ? 'error'
                              : issue.severity === 'Medium'
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {issue.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-100">{issue.department}</td>
                      <td className="px-4 py-3">
                        <Badge variant={issue.status === 'Open' ? 'error' : 'success'}>
                          {issue.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {(activeTab === 'policies' || activeTab === 'ack') && (
          <Card>
            <p className="text-slate-400">{tabs.find(t => t.value === activeTab)?.label} content coming soon...</p>
          </Card>
        )}
      </div>
    </>
  );
}
