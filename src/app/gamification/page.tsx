'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { StatusFlow } from '@/components/ui/ProgressBar';
import { mockChallenges, mockBadges, mockLeaderboard } from '@/lib/api';

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [challenges] = useState(mockChallenges);
  const [badges] = useState(mockBadges);
  const [leaderboard] = useState(mockLeaderboard);

  const tabs = [
    { label: 'Challenges', value: 'challenges', icon: '🎯' },
    { label: 'Participation', value: 'participation', icon: '👥' },
    { label: 'Badges', value: 'badges', icon: '🏆' },
    { label: 'Rewards', value: 'rewards', icon: '🎁' },
    { label: 'Leaderboard', value: 'leaderboard', icon: '📊' },
  ];

  const challengeStages = [
    { label: 'Draft', status: 'completed' as const },
    { label: 'Active', status: 'active' as const },
    { label: 'Under Review', status: 'pending' as const },
    { label: 'Completed', status: 'pending' as const },
    { label: 'Archived', status: 'pending' as const },
  ];

  return (
    <>
      <TopBar title="Gamification" />
      <div className="p-8 bg-dark-primary min-h-screen">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'challenges' && (
          <>
            <div className="mb-8">
              <Card>
                <h3 className="text-lg font-bold text-slate-100 mb-6">Challenge Status Pipeline</h3>
                <StatusFlow stages={challengeStages} />
              </Card>
            </div>

            <div className="mb-6">
              <Button variant="secondary" size="md">
                + New Challenge
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-100">{challenge.title}</h3>
                    <Badge
                      variant={
                        challenge.status === 'Active'
                          ? 'success'
                          : challenge.status === 'Draft'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {challenge.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4 flex-grow">
                    <p className="text-sm text-slate-400">
                      <span className="text-eco-orange font-bold">{challenge.xp} XP</span> • Difficulty:{' '}
                      <span className="text-eco-blue">{challenge.difficulty}</span>
                    </p>
                    <p className="text-sm text-slate-400">Deadline: {challenge.deadline}</p>
                    <p className="text-sm text-slate-400">{challenge.participants} participants</p>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-auto">
                    Join Challenge
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`flex flex-col items-center justify-center text-center p-6 ${
                  !badge.isUnlocked ? 'opacity-50' : ''
                }`}
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-slate-100 mb-2">{badge.name}</h3>
                <p className="text-sm text-slate-400 mb-2">{badge.description}</p>
                {badge.isUnlocked && badge.unlockedAt && (
                  <Badge variant="success" className="text-xs">
                    Unlocked {badge.unlockedAt}
                  </Badge>
                )}
                {!badge.isUnlocked && (
                  <Badge variant="default" className="text-xs">
                    Locked
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <Card>
            <h2 className="text-xl font-bold text-slate-100 mb-6">Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-surface">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Rank</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Employee/Dept</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">XP</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Badges</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Challenges</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="px-4 py-3">
                        <span className="font-bold text-eco-orange">#{entry.rank}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-slate-100">{entry.name}</p>
                          <p className="text-xs text-slate-500">{entry.department}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-eco-orange font-bold">{entry.xp}</td>
                      <td className="px-4 py-3">{entry.badges}</td>
                      <td className="px-4 py-3">{entry.challenges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {(activeTab === 'participation' || activeTab === 'rewards') && (
          <Card>
            <p className="text-slate-400">{tabs.find(t => t.value === activeTab)?.label} content coming soon...</p>
          </Card>
        )}
      </div>
    </>
  );
}
