'use client';

import React, { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  deadline: string;
  status: 'Draft' | 'Active' | 'Under Review' | 'Completed' | 'Archived';
}

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  isUnlocked: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  department: string;
  xp: number;
  badges: number;
  challenges: number;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Carbon Footprint Audit',
    xp: 250,
    difficulty: 'Hard',
    deadline: '2025-03-15',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Zero Waste Week',
    xp: 150,
    difficulty: 'Medium',
    deadline: '2025-02-28',
    status: 'Active',
  },
  {
    id: '3',
    title: 'Green Office Initiative',
    xp: 100,
    difficulty: 'Easy',
    deadline: '2025-03-30',
    status: 'Active',
  },
];

const mockBadges: Badge[] = [
  { id: '1', icon: '🌿', name: 'Eco Warrior', description: 'Complete 5 environmental challenges', isUnlocked: true },
  { id: '2', icon: '♻️', name: 'Recycler', description: 'Recycle 100+ items', isUnlocked: true },
  { id: '3', icon: '🌍', name: 'Planet Protector', description: 'Offset 10 tons of CO2', isUnlocked: false },
  { id: '4', icon: '⭐', name: 'Super Contributor', description: 'Earn 1000+ XP', isUnlocked: false },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Johnson', department: 'Operations', xp: 2450, badges: 8, challenges: 12 },
  { rank: 2, name: 'Michael Chen', department: 'Facilities', xp: 2150, badges: 6, challenges: 10 },
  { rank: 3, name: 'Emily Rodriguez', department: 'Supply Chain', xp: 1950, badges: 5, challenges: 9 },
  { rank: 4, name: 'James Wilson', department: 'HR', xp: 1750, badges: 4, challenges: 7 },
  { rank: 5, name: 'Lisa Anderson', department: 'Finance', xp: 1550, badges: 3, challenges: 6 },
];

const pipelineStages = [
  { label: 'Draft', color: 'border-gray-500' },
  { label: 'Active', color: 'border-green-500' },
  { label: 'Under Review', color: 'border-purple-500' },
  { label: 'Completed', color: 'border-blue-500' },
  { label: 'Archived', color: 'border-gray-500' },
];

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [challenges] = useState<Challenge[]>(mockChallenges);
  const [badges] = useState<Badge[]>(mockBadges);
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-orange-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      {/* Sub-Navigation Tabs */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[
          { id: 'challenges', label: 'Challenges' },
          { id: 'participation', label: 'Challenge Participation' },
          { id: 'badges', label: 'Badges' },
          { id: 'rewards', label: 'Rewards' },
          { id: 'leaderboard', label: 'Leaderboard' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenges Section */}
      {activeTab === 'challenges' && (
        <>
          {/* New Challenge Button */}
          <div className="mb-8">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              + New Challenge
            </button>
          </div>

          {/* Status Pipeline */}
          <div className="mb-12 bg-gray-800/80 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-100 mb-6">Challenge Status Pipeline</h3>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {pipelineStages.map((stage, index) => (
                <div key={stage.label} className="flex items-center gap-2 whitespace-nowrap">
                  {/* Stage Badge */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 ${stage.color} flex items-center justify-center bg-gray-900 flex-shrink-0`}
                  >
                    <span className="text-sm font-bold text-gray-300">{index + 1}</span>
                  </div>
                  
                  {/* Label */}
                  <span className="text-sm font-medium text-gray-400 text-center min-w-fit">{stage.label}</span>

                  {/* Arrow */}
                  {index < pipelineStages.length - 1 && (
                    <span className="text-gray-500 mx-2">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Challenge Cards (Horizontal Scroll) */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-gray-100 mb-6">Active Challenges</h3>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex-shrink-0 w-80 bg-gray-800/80 border border-orange-500 rounded-lg p-6 flex flex-col"
                >
                  {/* Title */}
                  <h4 className="text-lg font-bold text-gray-100 mb-4">{challenge.title}</h4>

                  {/* XP */}
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="text-orange-400 font-bold text-lg">{challenge.xp} XP</span>
                  </p>

                  {/* Difficulty */}
                  <p className={`text-sm font-medium mb-2 ${getDifficultyColor(challenge.difficulty)}`}>
                    Difficulty: {challenge.difficulty}
                  </p>

                  {/* Deadline */}
                  <p className="text-sm text-gray-400 mb-4">
                    Deadline:{' '}
                    {new Date(challenge.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-medium border border-green-500">
                      {challenge.status}
                    </span>
                  </div>

                  {/* Join Button */}
                  <button className="mt-auto bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full">
                    Join Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Badge Gallery & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Badge Gallery */}
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-6">Badge Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`bg-gray-800/80 border-2 border-orange-500 rounded-lg p-6 flex flex-col items-center text-center ${
                      !badge.isUnlocked ? 'opacity-40' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className="text-4xl mb-3">{badge.icon}</div>

                    {/* Name */}
                    <h4 className="font-bold text-gray-100 mb-2 text-sm">{badge.name}</h4>

                    {/* Description */}
                    <p className="text-xs text-gray-400 mb-3">{badge.description}</p>

                    {/* Status */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        badge.isUnlocked
                          ? 'bg-green-900/30 text-green-400 border border-green-500'
                          : 'bg-gray-700/30 text-gray-400 border border-gray-600'
                      }`}
                    >
                      {badge.isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h3 className="text-lg font-bold text-gray-100 mb-6">Leaderboard</h3>
              <div className="bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Header */}
                    <thead>
                      <tr className="border-b border-gray-700 bg-gray-800">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Name</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">XP</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">Badges</th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr
                          key={entry.rank}
                          className={`border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${
                            index === leaderboard.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          {/* Rank */}
                          <td className="px-4 py-3 text-sm">
                            <span className="font-bold text-orange-400">#{entry.rank}</span>
                          </td>

                          {/* Name */}
                          <td className="px-4 py-3 text-sm text-gray-100 font-medium">{entry.name}</td>

                          {/* XP */}
                          <td className="px-4 py-3 text-sm text-orange-400 font-bold text-right">{entry.xp}</td>

                          {/* Badges */}
                          <td className="px-4 py-3 text-sm text-gray-400 text-right">{entry.badges}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== 'challenges' && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">Content for {activeTab} coming soon...</p>
        </div>
      )}
    </div>
  );
}
