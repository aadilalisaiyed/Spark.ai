'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

// Semantic color palette
const semanticColors = {
  environmental: { bg: 'bg-emerald-50/10', border: 'border-emerald-500', text: 'text-emerald-400', gauge: '#10b981' },
  social: { bg: 'bg-orange-50/10', border: 'border-orange-500', text: 'text-orange-400', gauge: '#f97316' },
  governance: { bg: 'bg-blue-50/10', border: 'border-blue-500', text: 'text-blue-400', gauge: '#3b82f6' },
  overall: { bg: 'bg-cyan-50/10', border: 'border-cyan-500', text: 'text-cyan-400', gauge: '#06b6d4' },
};

const statusColors = {
  On_Track: { badge: 'border-green-500 text-green-400 bg-green-900/20', dot: 'bg-green-500' },
  At_Risk: { badge: 'border-yellow-500 text-yellow-400 bg-yellow-900/20', dot: 'bg-yellow-500' },
  Completed: { badge: 'border-green-500 text-green-400 bg-green-900/20', dot: 'bg-green-500' },
  Draft: { badge: 'border-gray-500 text-gray-400 bg-gray-700/20', dot: 'bg-gray-500' },
};

const CircularGauge = ({ value, max = 100, color }: { value: number; max?: number; color: string }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle cx="60" cy="60" r="45" fill="none" stroke="#374151" strokeWidth="8" />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-serif font-bold" style={{ color }}>{value}</span>
      </div>
    </div>
  );
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
      {/* Hero ESG Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Environmental Score */}
        <div className={`${semanticColors.environmental.bg} border-2 ${semanticColors.environmental.border} rounded-lg p-8 flex flex-col items-center justify-center`}>
          <div className="flex flex-col items-center gap-4">
            <CircularGauge value={scores.environmental} color={semanticColors.environmental.gauge} />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Environmental</p>
              <p className="text-sm text-gray-500">{scores.environmental}/100</p>
            </div>
          </div>
        </div>

        {/* Social Score */}
        <div className={`${semanticColors.social.bg} border-2 ${semanticColors.social.border} rounded-lg p-8 flex flex-col items-center justify-center`}>
          <div className="flex flex-col items-center gap-4">
            <CircularGauge value={scores.social} color={semanticColors.social.gauge} />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Social</p>
              <p className="text-sm text-gray-500">{scores.social}/100</p>
            </div>
          </div>
        </div>

        {/* Governance Score */}
        <div className={`${semanticColors.governance.bg} border-2 ${semanticColors.governance.border} rounded-lg p-8 flex flex-col items-center justify-center`}>
          <div className="flex flex-col items-center gap-4">
            <CircularGauge value={scores.governance} color={semanticColors.governance.gauge} />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Governance</p>
              <p className="text-sm text-gray-500">{scores.governance}/100</p>
            </div>
          </div>
        </div>

        {/* Overall ESG Score */}
        <div className={`${semanticColors.overall.bg} border-2 ${semanticColors.overall.border} rounded-lg p-8 flex flex-col items-center justify-center`}>
          <div className="flex flex-col items-center gap-4">
            <CircularGauge value={scores.overall} color={semanticColors.overall.gauge} />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Overall</p>
              <p className="text-sm text-gray-500">{scores.overall}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Emissions Trend */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Emissions Trend (12 mo)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emissionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke={semanticColors.environmental.gauge}
                strokeWidth={2}
                dot={{ fill: semanticColors.environmental.gauge }}
                name="CO₂ Emissions (t)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department ESG Ranking */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Department ESG Ranking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentRanking}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="department" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="score" fill={semanticColors.governance.gauge} name="ESG Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Goal Status Overview */}
      <div className="mb-8 bg-gray-800/80 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-100 mb-6">Key Goal Status Overview</h3>
        <div className="space-y-4">
          {keyGoals.map((goal) => {
            const statusColor = statusColors[goal.status];
            return (
              <div key={goal.id} className="flex items-center gap-4 pb-4 border-b border-gray-700 last:border-b-0">
                {/* Progress Indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${statusColor.dot}`}></div>
                </div>

                {/* Goal Title */}
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-100">{goal.title}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-24">
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">{goal.progress}%</p>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full border text-xs font-medium ${statusColor.badge}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="border-l-2 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-2xl">{activity.icon}</span>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
                <p className="font-medium text-gray-100">{activity.title}</p>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-gray-100 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              + Log Carbon Data
            </button>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Start Challenge
            </button>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
