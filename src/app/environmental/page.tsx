'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  Target, 
  TrendingDown,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface EnvironmentalGoal {
  id: string;
  name: string;
  department: string;
  targetCO2: number;
  currentCO2: number;
  progress: number;
  deadline: string;
  status: 'Active' | 'On_Track' | 'Completed' | 'At_Risk';
  owner: string;
  lastUpdated: string;
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
    status: 'On_Track',
    owner: 'Sarah Chen',
    lastUpdated: '2024-12-15',
  },
  {
    id: '2',
    name: 'Transition to Renewable Energy',
    department: 'Facilities',
    targetCO2: 200,
    currentCO2: 50,
    progress: 75,
    deadline: '2025-06-30',
    status: 'On_Track',
    owner: 'Mike Rodriguez',
    lastUpdated: '2024-12-18',
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
    owner: 'Emily Watson',
    lastUpdated: '2025-01-05',
  },
  {
    id: '4',
    name: 'Fleet Electrification Initiative',
    department: 'Logistics',
    targetCO2: 800,
    currentCO2: 180,
    progress: 22,
    deadline: '2025-09-30',
    status: 'At_Risk',
    owner: 'David Park',
    lastUpdated: '2024-12-22',
  },
  {
    id: '5',
    name: 'Supplier Carbon Offsetting',
    department: 'Procurement',
    targetCO2: 300,
    currentCO2: 45,
    progress: 15,
    deadline: '2025-11-15',
    status: 'Active',
    owner: 'Lisa Thompson',
    lastUpdated: '2025-01-02',
  },
];

const statusConfig = {
  On_Track: { 
    label: 'On Track', 
    color: '#16a34a', 
    bg: '#16a34a15',
    icon: CheckCircle2 
  },
  Completed: { 
    label: 'Completed', 
    color: '#3b82f6', 
    bg: '#3b82f615',
    icon: CheckCircle2 
  },
  At_Risk: { 
    label: 'At Risk', 
    color: '#f59e0b', 
    bg: '#f59e0b15',
    icon: AlertTriangle 
  },
  Active: { 
    label: 'Active', 
    color: '#06b6d4', 
    bg: '#06b6d415',
    icon: Clock 
  },
};

export default function Environmental() {
  const [goals] = useState<EnvironmentalGoal[]>(mockGoals);
  const [activeTab, setActiveTab] = useState('goals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('progress');

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => 
      goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [goals, searchQuery]);

  const tabs = [
    { id: 'factors', label: 'Emission Factors', count: 12 },
    { id: 'profiles', label: 'Product ESG Profiles', count: 45 },
    { id: 'transactions', label: 'Carbon Transactions', count: 230 },
    { id: 'goals', label: 'Environmental Goals', count: goals.length },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGoals(filteredGoals.map(g => g.id));
    } else {
      setSelectedGoals([]);
    }
  };

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return <Icon size={14} style={{ color: config.color }} />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'goals':
        return (
          <>
            {/* Toolbar */}
            <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                {/* Left side - Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search goals, departments, or owners..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-72 pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                    />
                  </div>

                  {/* Filter button */}
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition-colors">
                    <Filter size={16} />
                    Filters
                  </button>

                  {/* Bulk actions (visible when items selected) */}
                  {selectedGoals.length > 0 && (
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700">
                      <span className="text-sm text-gray-400">{selectedGoals.length} selected</span>
                      <button className="px-3 py-1.5 text-sm text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Right side - Export & View */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition-colors">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Target size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{goals.length}</p>
                    <p className="text-sm text-gray-400">Active Goals</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <TrendingDown size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">1,245 t</p>
                    <p className="text-sm text-gray-400">Total CO₂ Reduced</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Calendar size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">68%</p>
                    <p className="text-sm text-gray-400">Average Progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          checked={selectedGoals.length === filteredGoals.length && filteredGoals.length > 0}
                          className="rounded border-gray-600 bg-gray-800 checked:bg-green-600 focus:ring-green-500/20"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Goal Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        CO₂ Target
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Current
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {filteredGoals.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Search size={32} className="text-gray-600" />
                            <div>
                              <p className="text-gray-400 font-medium">No goals found</p>
                              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredGoals.map((goal) => {
                        const status = statusConfig[goal.status];
                        const isSelected = selectedGoals.includes(goal.id);

                        return (
                          <tr
                            key={goal.id}
                            className={`transition-colors hover:bg-gray-800/50 ${
                              isSelected ? 'bg-gray-800/70' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectGoal(goal.id)}
                                className="rounded border-gray-600 bg-gray-800 checked:bg-green-600 focus:ring-green-500/20"
                              />
                            </td>

                            {/* Goal Name */}
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-white">{goal.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Updated {goal.lastUpdated}</p>
                              </div>
                            </td>

                            {/* Department */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-gray-500" />
                                <span className="text-sm text-gray-300">{goal.department}</span>
                              </div>
                            </td>

                            {/* Target CO₂ */}
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-300 font-medium">{goal.targetCO2} t</span>
                            </td>

                            {/* Current CO₂ */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300">{goal.currentCO2} t</span>
                                <ArrowUpRight size={14} className="text-gray-600" />
                              </div>
.                            </td>

                            {/* Progress */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 max-w-[120px]">
                                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{ 
                                        width: `${goal.progress}%`, 
                                        backgroundColor: status.color 
                                      }}
                                    />
                                  </div>
                                </div>
                                <span className="text-sm font-medium text-gray-300 min-w-[3rem]">
                                  {goal.progress}%
                                </span>
                              </div>
                            </td>

                            {/* Owner */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-300">
                                    {goal.owner.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-300">{goal.owner}</span>
                              </div>
                            </td>

                            {/* Deadline */}
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-300">
                                {new Date(goal.deadline).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{
                                  color: status.color,
                                  backgroundColor: status.bg,
                                }}
                              >
                                {getStatusIcon(goal.status)}
                                {status.label}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                                <MoreHorizontal size={16} className="text-gray-500" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="border-t border-gray-800 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing <span className="text-white font-medium">{filteredGoals.length}</span> of{' '}
                  <span className="text-white font-medium">{goals.length}</span> goals
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg font-medium">
                    1
                  </button>
                  <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 'factors':
        return (
          <Card>
            <div className="text-white">Content for Emission Factors will be here.</div>
          </Card>
        );
      case 'profiles':
        return (
          <Card>
            <div className="text-white">Content for Product ESG Profiles will be here.</div>
          </Card>
        );
      case 'transactions':
        return (
          <Card>
            <div className="text-white">Content for Carbon Transactions will be here.</div>
          </Card>
        );
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Environmental Management</h1>
            <p className="text-gray-400 mt-1">Track and manage your carbon reduction initiatives</p>
          </div>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            <Plus size={18} />
            New Goal
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                : 'bg-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-800 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}