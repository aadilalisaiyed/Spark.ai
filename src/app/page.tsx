'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Award,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Shield,
  Leaf,
  Activity,
  Zap,
  Loader,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { apiService } from '@/lib/api';
import { DepartmentRanking, ESGScores, EmissionData, EmissionTrendData, RecentActivity } from '@/types';

type TimeRange = '6m' | '1y' | 'all';

type ScoreCard = {
  label: string;
  value: number;
  delta?: number;
  description: string;
  icon: React.ComponentType<any>;
  highlight?: boolean;
};

const ACCENT = '#16A34A';
const cardShell = 'bg-gray-800 border border-white/8 rounded-lg';

const statusTone = {
  Active: 'bg-white/5 text-gray-300 border-white/10',
  Completed: 'bg-white/5 text-gray-300 border-white/10',
  Paused: 'bg-white/5 text-gray-300 border-white/10',
} as const;

export default function Dashboard() {
  const [scores, setScores] = useState<ESGScores | null>(null);
  const [emissionTrend, setEmissionTrend] = useState<EmissionTrendData[]>([]);
  const [departmentRanking, setDepartmentRanking] = useState<DepartmentRanking[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [keyGoals, setKeyGoals] = useState<EmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const months = timeRange === '1y' ? 12 : 6;
      const [scoresRes, trendRes, rankingRes, activityRes, goalsRes] = await Promise.all([
        apiService.getESGScores(),
        apiService.getEmissionTrend(months),
        apiService.getDepartmentRanking(),
        apiService.getRecentActivities(),
        apiService.getKeyGoals(),
      ]);

      if (scoresRes.success && scoresRes.data) setScores(scoresRes.data);
      if (trendRes.success && trendRes.data) setEmissionTrend(trendRes.data);
      if (rankingRes.success && rankingRes.data) setDepartmentRanking(rankingRes.data);
      if (activityRes.success && activityRes.data) setRecentActivities(activityRes.data);
      if (goalsRes.success && goalsRes.data) setKeyGoals(goalsRes.data);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchDashboardData(true);
    }, 300000);

    return () => clearInterval(timer);
  }, [fetchDashboardData]);

  const scoreCards = useMemo(() => {
    const environmental = scores?.environmental ?? 0;
    const social = scores?.social ?? 0;
    const governance = scores?.governance ?? 0;
    const overall = scores?.overall ?? 0;

    return [
      { label: 'Environmental', value: environmental, delta: 3, description: 'Carbon, waste, and energy', icon: Leaf },
      { label: 'Social', value: social, delta: -1, description: 'People, community, and inclusion', icon: Users },
      { label: 'Governance', value: governance, delta: 5, description: 'Controls, audits, and compliance', icon: Shield },
      { label: 'Overall ESG', value: overall, description: 'Composite score across all pillars', icon: TrendingUp, highlight: true },
    ];
  }, [scores]);

  const goalSummary = useMemo(() => {
    const active = keyGoals.filter((goal) => goal.status === 'Active').length;
    const completed = keyGoals.filter((goal) => goal.status === 'Completed').length;
    const paused = keyGoals.filter((goal) => goal.status === 'Paused').length;
    const avgProgress = keyGoals.length > 0 ? Math.round(keyGoals.reduce((sum, goal) => sum + goal.progress, 0) / keyGoals.length) : 0;

    return { active, completed, paused, avgProgress };
  }, [keyGoals]);

  const summaryStats = [
    { label: 'Active Goals', value: goalSummary.active, icon: Target },
    { label: 'Completed', value: goalSummary.completed, icon: Award },
    { label: 'Paused', value: goalSummary.paused, icon: AlertTriangle },
    { label: 'Avg Progress', value: `${goalSummary.avgProgress}%`, icon: Activity },
  ];

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
        <div className="text-center">
          <Loader className="mx-auto mb-4 animate-spin text-green-500" size={40} />
          <p className="text-gray-200 text-lg">Loading dashboard data</p>
          <p className="text-gray-500 text-sm mt-1">Fetching live values from the backend</p>
        </div>
      </div>
    );
  }

  if (error && !scores) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-400" size={40} />
          <h1 className="text-xl font-semibold text-white mb-2">Unable to load dashboard</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-400">Live ESG data from the backend</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="hidden text-right text-xs text-gray-500 sm:block">
              Last updated<br />
              <span className="text-gray-300">{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          )}
          <div className="flex rounded-lg border border-white/8 bg-gray-800 p-1">
            {(['6m', '1y', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  timeRange === range ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
                style={timeRange === range ? { backgroundColor: `${ACCENT}22` } : undefined}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            className="rounded-lg border border-white/8 bg-gray-800 p-2.5 text-gray-300 transition-colors hover:text-white"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Zap size={16} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 mb-8">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${cardShell} p-4`}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2" style={{ backgroundColor: `${ACCENT}15` }}>
                  <Icon size={18} style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mb-8">
        {scoreCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${cardShell} p-6 ${card.highlight ? 'lg:col-span-1' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-400">{card.label}</p>
                  <p className="mt-2 text-sm text-gray-500">{card.description}</p>
                </div>
                <Icon size={18} className="text-gray-500" />
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-white">{card.value}</span>
                  {typeof card.delta === 'number' && card.delta !== 0 && (
                    <span className={`flex items-center gap-1 text-sm font-medium ${card.delta > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {card.delta > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {Math.abs(card.delta)}%
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${card.value}%`, backgroundColor: ACCENT }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <section className={`${cardShell} p-6`}>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">Emissions Trend</h2>
              <p className="mt-1 text-sm text-gray-500">Monthly CO₂ output</p>
            </div>
            <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-gray-400">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={emissionTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2b3440" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="emissions" stroke={ACCENT} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className={`${cardShell} p-6`}>
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">Department Ranking</h2>
            <p className="mt-1 text-sm text-gray-500">ESG performance by department</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentRanking} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2b3440" vertical={false} />
              <XAxis dataKey="department" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="score" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className={`${cardShell} p-6 lg:col-span-2`}>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">Key Goals</h2>
              <p className="mt-1 text-sm text-gray-500">Live progress from environmental goals</p>
            </div>
          </div>

          {keyGoals.length > 0 ? (
            <div className="space-y-5">
              {keyGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">{goal.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{goal.department}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                      <span className={`rounded-md border px-2 py-1 text-xs ${statusTone[goal.status as keyof typeof statusTone]}`}>{goal.status}</span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full rounded-full" style={{ width: `${goal.progress}%`, backgroundColor: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-sm text-gray-500">No goal data available.</p>
          )}
        </section>

        <div className="space-y-8">
          <section className={`${cardShell} p-6`}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.slice(0, 3).map((activity, index) => (
                <div key={activity.id} className={index < 2 ? 'border-b border-white/8 pb-4' : ''}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{activity.description}</p>
                      <p className="mt-1 text-xs text-gray-600">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`${cardShell} p-6`}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white" style={{ backgroundColor: ACCENT }}>
                Log Carbon Data
              </button>
              <button className="w-full rounded-lg border border-white/8 bg-gray-700 px-4 py-3 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-600">
                View Reports
              </button>
              <button className="w-full rounded-lg border border-white/8 bg-gray-700 px-4 py-3 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-600">
                Review Goals
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
