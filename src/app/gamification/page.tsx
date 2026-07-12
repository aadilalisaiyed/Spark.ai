'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Star, Zap, Clock, Users, Target, Award, 
  TrendingUp, Calendar, CheckCircle2, Lock, Sparkles,
  ArrowUp, ArrowDown, Medal, Gift, Flame, Swords,
  Timer, ChevronRight, Filter, Search, Share2, Eye,
  Play, Pause, RotateCcw, MoreHorizontal, Plus,
  Crown, Gem, Leaf, Heart, Shield
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  deadline: string;
  status: 'Draft' | 'Active' | 'Under Review' | 'Completed' | 'Archived';
  participants: number;
  progress: number;
  category: string;
  timeLeft: string;
}

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  progress: number;
  totalNeeded: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  department: string;
  avatar: string;
  xp: number;
  badges: number;
  challenges: number;
  streak: number;
  change: 'up' | 'down' | 'same';
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Carbon Footprint Audit',
    description: 'Complete a comprehensive audit of your department\'s carbon emissions and identify reduction opportunities.',
    xp: 250,
    difficulty: 'Hard',
    deadline: '2025-03-15',
    status: 'Active',
    participants: 45,
    progress: 65,
    category: 'Environmental',
    timeLeft: '2 months',
  },
  {
    id: '2',
    title: 'Zero Waste Week',
    description: 'Go an entire week without generating any non-recyclable waste in your office.',
    xp: 150,
    difficulty: 'Medium',
    deadline: '2025-02-28',
    status: 'Active',
    participants: 120,
    progress: 40,
    category: 'Waste Management',
    timeLeft: '1 month',
  },
  {
    id: '3',
    title: 'Green Office Initiative',
    description: 'Transform your workspace into an eco-friendly environment with sustainable practices.',
    xp: 100,
    difficulty: 'Easy',
    deadline: '2025-03-30',
    status: 'Active',
    participants: 230,
    progress: 85,
    category: 'Workplace',
    timeLeft: '3 months',
  },
  {
    id: '4',
    title: 'Supply Chain Sustainability',
    description: 'Evaluate and improve the sustainability score of your top 5 suppliers.',
    xp: 300,
    difficulty: 'Hard',
    deadline: '2025-04-15',
    status: 'Active',
    participants: 34,
    progress: 25,
    category: 'Supply Chain',
    timeLeft: '3 months',
  },
];

const mockBadges: Badge[] = [
  { 
    id: '1', icon: '🌿', name: 'Eco Warrior', 
    description: 'Complete 5 environmental challenges', 
    isUnlocked: true, rarity: 'Common',
    progress: 5, totalNeeded: 5
  },
  { 
    id: '2', icon: '♻️', name: 'Recycler', 
    description: 'Recycle 100+ items in the office', 
    isUnlocked: true, rarity: 'Rare',
    progress: 100, totalNeeded: 100
  },
  { 
    id: '3', icon: '🌍', name: 'Planet Protector', 
    description: 'Offset 10 tons of CO2 emissions', 
    isUnlocked: false, rarity: 'Epic',
    progress: 7, totalNeeded: 10
  },
  { 
    id: '4', icon: '⭐', name: 'Super Contributor', 
    description: 'Earn 1000+ XP in challenges', 
    isUnlocked: false, rarity: 'Legendary',
    progress: 650, totalNeeded: 1000
  },
  { 
    id: '5', icon: '🔥', name: 'Streak Master', 
    description: 'Maintain a 30-day challenge streak', 
    isUnlocked: false, rarity: 'Epic',
    progress: 18, totalNeeded: 30
  },
  { 
    id: '6', icon: '💚', name: 'Green Heart', 
    description: 'Participate in 20 community events', 
    isUnlocked: false, rarity: 'Rare',
    progress: 12, totalNeeded: 20
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Johnson', department: 'Operations', avatar: 'SJ', xp: 2450, badges: 8, challenges: 12, streak: 45, change: 'up' },
  { rank: 2, name: 'Michael Chen', department: 'Facilities', avatar: 'MC', xp: 2150, badges: 6, challenges: 10, streak: 32, change: 'down' },
  { rank: 3, name: 'Emily Rodriguez', department: 'Supply Chain', avatar: 'ER', xp: 1950, badges: 5, challenges: 9, streak: 28, change: 'up' },
  { rank: 4, name: 'James Wilson', department: 'HR', avatar: 'JW', xp: 1750, badges: 4, challenges: 7, streak: 15, change: 'same' },
  { rank: 5, name: 'Lisa Anderson', department: 'Finance', avatar: 'LA', xp: 1550, badges: 3, challenges: 6, streak: 21, change: 'up' },
];

const pipelineStages = [
  { label: 'Draft', color: '#6b7280', icon: Clock },
  { label: 'Active', color: '#f59e0b', icon: Play },
  { label: 'Under Review', color: '#8b5cf6', icon: Eye },
  { label: 'Completed', color: '#16a34a', icon: CheckCircle2 },
  { label: 'Archived', color: '#9ca3af', icon: RotateCcw },
];

const rarityConfig = {
  Common: { color: '#9ca3af', bg: '#9ca3af15', glow: '' },
  Rare: { color: '#3b82f6', bg: '#3b82f615', glow: 'shadow-blue-500/20' },
  Epic: { color: '#8b5cf6', bg: '#8b5cf615', glow: 'shadow-purple-500/30' },
  Legendary: { color: '#f59e0b', bg: '#f59e0b15', glow: 'shadow-yellow-500/40' },
};

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [badges] = useState<Badge[]>(mockBadges);
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedXP, setAnimatedXP] = useState<{ [key: string]: number }>({});
  const progressBarRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Animate XP and progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      challenges.forEach(challenge => {
        animateValue(challenge.id, 0, challenge.progress, 1500);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [challenges]);

  const animateValue = (id: string, start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      setAnimatedXP(prev => ({ ...prev, [id]: currentValue }));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' };
      case 'Medium': return { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
      case 'Hard': return { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
      default: return { text: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // Animation logic here
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                backgroundColor: ['#f59e0b', '#16a34a', '#3b82f6', '#8b5cf6', '#ef4444'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Swords className="text-orange-400" size={32} />
              ESG Gamification
              <span className="text-sm font-normal text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                Beta
              </span>
            </h1>
            <p className="text-gray-400 mt-2">Complete challenges, earn badges, and climb the leaderboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-400" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Your Streak</p>
                  <p className="text-lg font-bold text-white">21 Days</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Total XP</p>
                  <p className="text-lg font-bold text-white">1,250</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs with Animations */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'challenges', label: 'Challenges', icon: Swords, count: 12 },
          { id: 'participation', label: 'Participation', icon: Users, count: 234 },
          { id: 'badges', label: 'Badges', icon: Award, count: 24 },
          { id: 'rewards', label: 'Rewards', icon: Gift, count: 8 },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, count: 50 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105'
                  : 'bg-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              <Icon size={16} className={activeTab === tab.id ? 'animate-pulse' : ''} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Challenges Section */}
      {activeTab === 'challenges' && (
        <>
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setFilterDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      filterDifficulty === difficulty
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {difficulty === 'all' ? 'All' : difficulty}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105">
              <Plus size={18} />
              New Challenge
            </button>
          </div>

          {/* Pipeline Visualization with Animations */}
          <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Challenge Pipeline</h3>
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-700 via-orange-500 to-gray-700 hidden lg:block" />
              
              <div className="flex items-start justify-between gap-4 overflow-x-auto pb-2">
                {pipelineStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const count = challenges.filter(c => c.status === stage.label).length;
                  const isActive = stage.label === 'Active';
                  
                  return (
                    <div key={stage.label} className="flex flex-col items-center gap-2 min-w-fit relative z-10">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isActive 
                            ? 'bg-orange-500 shadow-lg shadow-orange-500/30 animate-pulse-slow' 
                            : 'bg-gray-800'
                        }`}
                        style={{ 
                          borderColor: stage.color,
                          borderWidth: '2px',
                        }}
                      >
                        <Icon size={24} style={{ color: stage.color }} />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{stage.label}</span>
                      <span className="text-sm font-bold text-white">{count}</span>
                      
                      {index < pipelineStages.length - 1 && (
                        <ChevronRight className="hidden lg:block absolute -right-6 top-5 text-gray-600" size={20} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Challenge Cards Grid with Advanced Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredChallenges.map((challenge, idx) => {
              const difficultyColors = getDifficultyColor(challenge.difficulty);
              const progress = animatedXP[challenge.id] || 0;
              
              return (
                <div
                  key={challenge.id}
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animation: 'slideUp 0.6s ease-out forwards',
                  }}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Difficulty Ribbon */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${difficultyColors.text} ${difficultyColors.bg} ${difficultyColors.border} border`}>
                    {challenge.difficulty}
                  </div>

                  <div className="p-6 relative">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">
                        {challenge.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {challenge.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {challenge.description}
                    </p>

                    {/* XP and Participants */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Zap className="text-orange-400" size={16} />
                        <span className="text-sm font-bold text-orange-400">{challenge.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-400">{challenge.participants} participants</span>
                      </div>
                    </div>

                    {/* Progress Bar with Glow Effect */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="relative h-2.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          ref={(el) => {
                            progressBarRefs.current[challenge.id] = el;
                          }}
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                            boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Deadline and Time Left */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(challenge.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer size={12} />
                        <span>{challenge.timeLeft}</span>
                      </div>
                    </div>

                    {/* Action Button with Ripple Effect */}
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="relative w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Join Challenge
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Badge Gallery & Leaderboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Badge Gallery */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Badge Collection</h3>
                  <p className="text-sm text-gray-400 mt-1">Unlock all badges to become a legend</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{badges.filter(b => b.isUnlocked).length}/{badges.length} unlocked</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, idx) => {
                  const rarity = rarityConfig[badge.rarity];
                  
                  return (
                    <div
                      key={badge.id}
                      className={`group relative bg-gray-800 rounded-xl p-5 border transition-all duration-500 ${
                        badge.isUnlocked 
                          ? 'border-orange-500/20 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10' 
                          : 'border-gray-700 opacity-60 hover:opacity-80'
                      }`}
                      style={{
                        animationDelay: `${idx * 100}ms`,
                        animation: 'slideUp 0.6s ease-out forwards',
                      }}
                    >
                      {/* Rarity Glow Effect */}
                      {badge.isUnlocked && (
                        <div 
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ boxShadow: `0 0 30px ${rarity.color}20` }}
                        />
                      )}

                      <div className="relative">
                        {/* Badge Icon with Spin Animation */}
                        <div className={`text-4xl mb-3 transform transition-transform duration-500 ${
                          badge.isUnlocked ? 'group-hover:scale-110 group-hover:rotate-12' : ''
                        }`}>
                          {badge.icon}
                          {!badge.isUnlocked && (
                            <Lock className="absolute top-0 right-0 text-gray-500" size={16} />
                          )}
                        </div>

                        {/* Badge Name */}
                        <h4 className="font-semibold text-white mb-1 text-sm">{badge.name}</h4>
                        
                        {/* Description */}
                        <p className="text-xs text-gray-400 mb-3">{badge.description}</p>

                        {/* Progress to Unlock (if locked) */}
                        {!badge.isUnlocked && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{badge.progress}/{badge.totalNeeded}</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ 
                                  width: `${(badge.progress / badge.totalNeeded) * 100}%`,
                                  background: `linear-gradient(90deg, ${rarity.color}, ${rarity.color}88)`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Rarity Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ color: rarity.color, backgroundColor: rarity.bg }}
                          >
                            {badge.rarity}
                          </span>
                          {badge.isUnlocked && (
                            <CheckCircle2 size={14} className="text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
                  <p className="text-sm text-gray-400 mt-1">Top performers this month</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <Trophy key={i} size={16} className={i === 1 ? 'text-yellow-400' : i === 2 ? 'text-gray-400' : 'text-orange-600'} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={entry.rank}
                    className="group flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all duration-300 hover:scale-102 cursor-pointer"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                      animation: 'slideIn 0.6s ease-out forwards',
                    }}
                  >
                    {/* Rank */}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-400/20' :
                        entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                        entry.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {entry.rank}
                      </div>
                      {entry.rank <= 3 && (
                        <Crown 
                          size={12} 
                          className="absolute -top-2 -right-2 text-yellow-400 animate-bounce-slow" 
                        />
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center font-medium text-white">
                      {entry.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
                        {entry.streak > 20 && (
                          <Flame size={12} className="text-orange-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{entry.department}</p>
                    </div>

                    {/* XP and Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-sm font-bold text-orange-400">{entry.xp}</span>
                        <span className="text-xs text-gray-500">XP</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <span className="text-xs text-gray-500">{entry.badges} badges</span>
                        {entry.change === 'up' && <ArrowUp size={12} className="text-green-400" />}
                        {entry.change === 'down' && <ArrowDown size={12} className="text-red-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Full Leaderboard */}
              <button className="w-full mt-4 py-3 text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-400/5 rounded-xl transition-all flex items-center justify-center gap-2">
                View Full Leaderboard
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}