'use client';

import React, { useState } from 'react';

interface EnvironmentalGoal {
  id: string;
  name: string;
  department: string;
  targetCO2: number;
  currentCO2: number;
  progress: number;
  deadline: string;
  status: 'Active' | 'On Track' | 'Completed';
}

const mockGoals: EnvironmentalGoal[] = [
  {
    id: '1',
    name: 'Reduce Manufacturing Emissions',
    department: 'Operations',
    targetCO2: 500,
    currentCO2: 350,
    progress: 70,
    deadline: '2025-12-31',
    status: 'On Track',
  },
  {
    id: '2',
    name: 'Transition to Renewable Energy',
    department: 'Facilities',
    targetCO2: 200,
    currentCO2: 50,
    progress: 75,
    deadline: '2025-06-30',
    status: 'On Track',
  },
  {
    id: '3',
    name: 'Waste Reduction Program',
    department: 'Supply Chain',
    targetCO2: 100,
    currentCO2: 100,
    progress: 100,
    deadline: '2025-03-31',
    status: 'Completed',
  },
];

export default function Environmental() {
  const [goals] = useState<EnvironmentalGoal[]>(mockGoals);
  const [activeTab, setActiveTab] = useState('goals');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'border-blue-500 text-blue-400';
      case 'On Track':
        return 'border-green-500 text-green-400';
      case 'Completed':
        return 'border-purple-500 text-purple-400';
      default:
        return 'border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      {/* Sub-Navigation Tabs */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[
          { id: 'factors', label: 'Emission Factors' },
          { id: 'profiles', label: 'Product ESG Profiles' },
          { id: 'transactions', label: 'Carbon Transactions' },
          { id: 'goals', label: 'Environmental Goals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        {/* Left Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap">
            + New Goal
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap">
            Edit
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap">
            Delete
          </button>
          <div className="relative">
            <button className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap">
              Export ▼
            </button>
          </div>
        </div>

        {/* Right Search */}
        <input
          type="text"
          placeholder="Search goals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Target CO₂</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Current CO₂</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Deadline</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {goals.map((goal, index) => (
                <tr
                  key={goal.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${
                    index === goals.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  {/* Name */}
                  <td className="px-6 py-4 text-sm text-gray-100 font-medium">{goal.name}</td>

                  {/* Department */}
                  <td className="px-6 py-4 text-sm text-gray-400">{goal.department}</td>

                  {/* Target CO2 */}
                  <td className="px-6 py-4 text-sm text-gray-400">{goal.targetCO2} t</td>

                  {/* Current CO2 */}
                  <td className="px-6 py-4 text-sm text-gray-400">{goal.currentCO2} t</td>

                  {/* Progress Bar */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-xs font-medium w-10">{goal.progress}%</span>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(goal.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full border font-medium text-xs ${getStatusColor(
                        goal.status
                      )}`}
                    >
                      {goal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State (if needed) */}
        {goals.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400">No environmental goals found.</p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-400 text-right">
        Showing {goals.length} of {goals.length} goals
      </div>
    </div>
  );
}
