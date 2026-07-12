'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, Users, Shield, Leaf, Plus, Zap, FileText } from 'lucide-react';
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
  { id: '1', title: 'Reduce Fleet Emissions by 30%', category: 'Environmental', progress: 78, status: 'On_Track' },
  { id: '2', title: 'Increase DEI Hires to 40%', category: 'Social', progress: 55, status: 'At_Risk' },
  { id: '3', title: 'Complete Supplier Code of Conduct Audit', category: 'Governance', progress: 100, status: 'Completed' },
  { id: '4', title: 'Achieve Q4 Waste Reduction Target', category: 'Environmental', progress: 10, status: 'Draft' },
];

const statusConfig = {
  On_Track: { label: 'On Track', color: '#16a34a', bg: '#16a34a15' },
  At_Risk: { label: 'At Risk', color: '#f59e0b', bg: '#f59e0b15' },
  Completed: { label: 'Completed', color: '#3b82f6', bg: '#3b82f615' },
  Draft: { label: 'Draft', color: '#6b7280', bg: '#6b728015' },
};

export default function Dashboard() {
  const [scores, setScores] = useState<ESGScores>(mockESGScores);
  const [keyGoals] = useState<KeyGoal[]>(mockKeyGoals);
  const [emissionTrend] = useState(mockEmissionTrend);
  const [departmentRanking] = useState(mockDepartmentRanking);
  const [recentActivities] = useState(mockRecentActivities);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchScores = async () => {
      const response = await apiService.getESGScores();
      if (response.success && response.data) {
        setScores(response.data);
      }
    };
    fetchScores();
  }, []);

  const scoreCards = [
    { 
      label: 'Environmental', 
      value: scores.environmental, 
      delta: 3, 
      icon: Leaf,
      color: '#16a34a',
      description: 'Carbon, waste & water management'
    },
    { 
      label: 'Social', 
      value: scores.social, 
      delta: -1, 
      icon: Users,
      color: '#f59e0b',
      description: 'DEI, labor practices & community'
    },
    { 
      label: 'Governance', 
      value: scores.governance, 
      delta: 5, 
      icon: Shield,
      color: '#3b82f6',
      description: 'Ethics, compliance & transparency'
    },
    { 
      label: 'Overall ESG', 
      value: scores.overall, 
      isMain: true,
      icon: TrendingUp,
      color: '#8b5cf6',
      description: 'Composite score across all pillars'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          {greeting}, <span className="text-gray-400">Alex</span>
        </h1>
        <p className="text-gray-400 mt-1">Here's your ESG performance overview for today</p>
      </div>

      {/* ESG Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {scoreCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">{card.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {card.value}
                  </span>
                  {card.delta !== undefined && (
                    <span
                      className={`flex items-center gap-1 text-sm font-medium ${
                        card.delta > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {card.delta > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {Math.abs(card.delta)}%
                    </span>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${card.value}%`, 
                      backgroundColor: card.color,
                      boxShadow: `0 0 12px ${card.color}40`
                    }}
                  />
                </div>
                
                <p className="text-xs text-gray-500">out of 100 points</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Emissions Trend */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Emissions Trend</h3>
              <p className="text-sm text-gray-400 mt-1">Monthly CO₂ output in tonnes</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">This Year</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={emissionTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280" 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280" 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#F3F4F6', fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#16a34a', stroke: '#111827', strokeWidth: 2 }}
                name="CO₂ (tonnes)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Ranking */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Department Ranking</h3>
              <p className="text-sm text-gray-400 mt-1">ESG performance by team</p>
            </div>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-gray-600">
              <option>Q4 2024</option>
              <option>Q3 2024</option>
              <option>Q2 2024</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentRanking} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="department" 
                stroke="#6B7280" 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280" 
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#F3F4F6', fontWeight: 600 }}
              />
              <Bar 
                dataKey="score" 
                fill="#16a34a" 
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Goals & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Goals */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Key Goals Progress</h3>
              <p className="text-sm text-gray-400 mt-1">Track your ESG targets</p>
            </div>
          </div>
          
          <div className="space-y-5">
            {keyGoals.map((goal) => {
              const status = statusConfig[goal.status];
              return (
                <div key={goal.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-gray-200 transition-colors">
                        {goal.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{goal.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          color: status.color,
                          backgroundColor: status.bg,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${goal.progress}%`, 
                        backgroundColor: status.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.slice(0, 3).map((activity, idx) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-gray-600 mt-1.5">{activity.timestamp}</p>
                    </div>
                  </div>
                  {idx < recentActivities.slice(0, 3).length - 1 && (
                    <div className="border-t border-gray-800 mt-3 pt-3" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                <Plus size={18} />
                Log Carbon Data
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-750 text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-700">
                <Zap size={18} />
                Start Challenge
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-750 text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-700">
                <FileText size={18} />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}