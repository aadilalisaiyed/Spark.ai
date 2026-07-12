'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService, mockEmissionTrend, mockDepartmentRanking, mockRecentActivities, mockESGScores } from '@/lib/api';
import { ESGScores } from '@/types';

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
    <div className="p-8 bg-gray-900 min-h-screen">
      {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Environmental Score */}
          <div className="bg-gray-800/80 border-l-4 border-green-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Environmental Score</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-green-500">{scores.environmental}</span>
              <span className="text-gray-400 ml-2">/ 100</span>
            </div>
          </div>

          {/* Social Score */}
          <div className="bg-gray-800/80 border-l-4 border-blue-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Social Score</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-blue-500">{scores.social}</span>
              <span className="text-gray-400 ml-2">/ 100</span>
            </div>
          </div>

          {/* Governance Score */}
          <div className="bg-gray-800/80 border-l-4 border-purple-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Governance Score</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-purple-500">{scores.governance}</span>
              <span className="text-gray-400 ml-2">/ 100</span>
            </div>
          </div>

          {/* Overall ESG Score */}
          <div className="bg-gray-800/80 border-l-4 border-blue-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Overall ESG Score</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-blue-500">{scores.overall}</span>
              <span className="text-gray-400 ml-2">/ 100</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Emissions Trend */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Emissions Trend (12 months)</h3>
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
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
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
                <Bar dataKey="score" fill="#3b82f6" name="ESG Score" />
              </BarChart>
            </ResponsiveContainer>
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
