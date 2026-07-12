'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { mockDepartments } from '@/lib/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments] = useState(mockDepartments);
  const [toggles, setToggles] = useState({
    autoEmission: true,
    requireEvidence: false,
    autoBadge: true,
    emailAlerts: true,
  });

  const tabs = [
    { label: 'Departments', value: 'departments', icon: '🏢' },
    { label: 'Categories', value: 'categories', icon: '📂' },
    { label: 'ESG Configuration', value: 'config', icon: '⚙️' },
    { label: 'Notification Settings', value: 'notifications', icon: '🔔' },
  ];

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-eco-green' : 'bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <>
      <TopBar title="Settings" />
      <div className="p-8 bg-dark-primary min-h-screen">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'departments' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Departments</h2>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  + New Department
                </Button>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-surface">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Code</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Head</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Parent Dept</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Employees</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="px-4 py-3 text-slate-100 font-medium">{dept.name}</td>
                      <td className="px-4 py-3 text-slate-100">{dept.code}</td>
                      <td className="px-4 py-3 text-slate-100">{dept.head}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {dept.parentDeptId ? 'Parent Dept' : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-100">{dept.employees}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">{dept.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'config' && (
          <Card className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-6">ESG Configuration</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-slate-100">
                    Enable auto emission calculation
                  </p>
                  <p className="text-sm text-slate-400">
                    Automatically calculate emissions from activity logs
                  </p>
                </div>
                <ToggleSwitch
                  checked={toggles.autoEmission}
                  onChange={() => toggleSetting('autoEmission')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-slate-100">
                    Require evidence for all CSR activities
                  </p>
                  <p className="text-sm text-slate-400">
                    Mandatory photo/video proof for CSR participation
                  </p>
                </div>
                <ToggleSwitch
                  checked={toggles.requireEvidence}
                  onChange={() => toggleSetting('requireEvidence')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-slate-100">
                    Auto-award badges on challenge completion
                  </p>
                  <p className="text-sm text-slate-400">
                    Automatically issue badges when criteria are met
                  </p>
                </div>
                <ToggleSwitch
                  checked={toggles.autoBadge}
                  onChange={() => toggleSetting('autoBadge')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-slate-100">
                    Email alerts for new compliance issues
                  </p>
                  <p className="text-sm text-slate-400">
                    Send notifications to admins on new issues
                  </p>
                </div>
                <ToggleSwitch
                  checked={toggles.emailAlerts}
                  onChange={() => toggleSetting('emailAlerts')}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <Button variant="primary">Save Settings</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </Card>
        )}

        {(activeTab === 'categories' || activeTab === 'notifications') && (
          <Card>
            <p className="text-slate-400">
              {tabs.find(t => t.value === activeTab)?.label} settings coming soon...
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
