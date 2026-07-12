'use client';

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, KPITile } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiService, mockEmissionTrend, mockDepartmentRanking, mockRecentActivities, mockESGScores } from '@/lib/api';
import { ESGScores, DepartmentRanking, RecentActivity } from '@/types';

export default function Dashboard() {
  const [scores, setScores] = useState<ESGScores>(mockESGScores);
  const [emissionTrend] = useState(mockEmissionTrend);
  const [departmentRanking] = useState(mockDepartmentRanking);
  const [recentActivities] = useState(mockRecentActivities);

  useEffect(() => {
    const fetchScores = async () => {
      const response = await apiService.getESGScores();
      if (response.success && response.data) {
        setScores(response.data);
      }
    };
    fetchScores();
  }, []);

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-8 bg-dark-primary min-h-screen">
        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPITile
            title="Environmental Score"
            value={scores.environmental}
            unit="/ 100"
            borderColor="green"
            icon="🌱"
          />
          <KPITile
            title="Social Score"
            value={scores.social}
            unit="/ 100"
            borderColor="blue"
            icon="👥"
          />
          <KPITile
            title="Governance Score"
            value={scores.governance}
            unit="/ 100"
            borderColor="purple"
            icon="⚖️"
          />
          <KPITile
            title="Overall ESG Score"
            value={scores.overall}
            unit="/ 100"
            borderColor="blue"
            icon="📊"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Emissions Trend */}
          <Card className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Emissions Trend (12 months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emissionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="CO₂ Emissions (t)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Department ESG Ranking */}
          <Card className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Department ESG Ranking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentRanking}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="department" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="score" fill="#3b82f6" name="ESG Score" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Activity & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border-l-2 border-eco-blue pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-2xl">{activity.icon}</span>
                    <span className="text-xs text-slate-500">{activity.timestamp}</span>
                  </div>
                  <p className="font-medium text-slate-100">{activity.title}</p>
                  <p className="text-sm text-slate-400">{activity.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-6">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button className="w-full" variant="primary">
                + Log Carbon Data
              </Button>
              <Button className="w-full" variant="secondary">
                Start Challenge
              </Button>
              <Button className="w-full" variant="ghost">
                View Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
