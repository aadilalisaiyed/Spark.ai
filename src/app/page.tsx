'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService, mockEmissionTrend, mockDepartmentRanking, mockRecentActivities, mockESGScores } from '@/lib/api';
import { ESGScores } from '@/types';

interface KeyGoal {
  id: string;
  title: string;
  category: 'Environmental' | 'Social' | 'Governance';
  progress: number;
  status: 'On_Track' | 'At_Risk' | 'Completed' | 'Draft';
}

const mockKeyGoals: KeyGoal[] = [
  { id: '1', title: 'Reduce Fleet Emissions (Env)', category: 'Environmental', progress: 78, status: 'On_Track' },
  { id: '2', title: 'Increase DEI Hires (Soc)', category: 'Social', progress: 55, status: 'At_Risk' },
  { id: '3', title: 'Supplier Code of Conduct Audit (Gov)', category: 'Governance', progress: 100, status: 'Completed' },
  { id: '4', title: 'Q4 Waste Target (Env)', category: 'Environmental', progress: 10, status: 'Draft' },
];

// Single accent color for the entire app
const ACCENT_COLOR = '#16A34A'; // Moss green
const ACCENT_COLOR_RGB = '22, 163, 74';

const statusConfig = {
  On_Track: { label: 'On Track', color: '#16A34A' },
  At_Risk: { label: 'At Risk', color: '#DC2626' },
  Completed: { label: 'Completed', color: '#16A34A' },
  Draft: { label: 'Draft', color: '#6B7280' },
};

export default function Dashboard() {
  const [scores, setScores] = useState<ESGScores>(mockESGScores);
  const [keyGoals] = useState<KeyGoal[]>(mockKeyGoals);
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
    <div className="p-8 bg-gray-900 min-h-screen">
      {/* ESG Scores - Identical Cards with Neutral Border */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Environmental', value: scores.environmental },
          { label: 'Social', value: scores.social },
          { label: 'Governance', value: scores.governance },
          { label: 'Overall', value: scores.overall, isMain: true },
        ].map((score, idx) => (
          <div
            key={idx}
            className={`bg-gray-800 border border-white/8 rounded-lg p-6 ${
              score.isMain ? 'md:col-span-2 lg:col-span-1 md:row-span-1' : ''
            }`}
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                {score.label} Score
              </p>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{score.value}</span>
                  <span className="text-sm text-gray-400">/ 100</span>
                </div>
                {/* Thin progress bar - single accent color */}
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${score.value}%`, backgroundColor: ACCENT_COLOR }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid - Single Accent Color */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Emissions Trend */}
        <div className="bg-gray-800 border border-white/8 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-6">
            Emissions Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={emissionTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#2D3748" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke={ACCENT_COLOR}
                strokeWidth={2}
                dot={false}
                name="CO₂ (tonnes)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Ranking */}
        <div className="bg-gray-800 border border-white/8 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-6">
            Department ESG Ranking
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentRanking} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#2D3748" vertical={false} />
              <XAxis dataKey="department" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="score" fill={ACCENT_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Goal Status Overview */}
      <div className="mb-8 bg-gray-800 border border-white/8 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-8">
          Key Goal Status
        </h3>
        <div className="space-y-6">
          {keyGoals.map((goal, idx) => {
            const statusInfo = statusConfig[goal.status];
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">{goal.title}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{
                        color: statusInfo.color,
                        backgroundColor: `${statusInfo.color}10`,
                        border: `1px solid ${statusInfo.color}30`,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
                {/* Thin progress bar */}
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${goal.progress}%`, backgroundColor: ACCENT_COLOR }}
                  />
                </div>
                {idx < keyGoals.length - 1 && <div className="border-t border-gray-700 mt-6 pt-6" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2 bg-gray-800 border border-white/8 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 4).map((activity, idx) => (
              <div key={activity.id}>
                <div className="flex items-start gap-4">
                  <span className="text-xl mt-1">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-600 mt-2">{activity.timestamp}</p>
                  </div>
                </div>
                {idx < recentActivities.slice(0, 4).length - 1 && (
                  <div className="border-t border-gray-700 mt-4 pt-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-gray-800 border border-white/8 rounded-lg p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Primary action - uses accent color */}
            <button
              className="w-full font-medium py-3 px-4 rounded-lg transition-all text-white"
              style={{
                backgroundColor: ACCENT_COLOR,
                color: 'white',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              + Log Carbon Data
            </button>

            {/* Secondary actions - neutral */}
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-3 px-4 rounded-lg transition-colors">
              Start Challenge
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-3 px-4 rounded-lg transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
