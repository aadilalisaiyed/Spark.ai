import axios from 'axios';
import {
  Employee,
  Department,
  EmissionData,
  EmissionTrendData,
  CSRActivity,
  ActivityParticipation,
  Audit,
  ComplianceIssue,
  Challenge,
  Badge,
  LeaderboardEntry,
  ESGScores,
  DepartmentRanking,
  RecentActivity,
  ApiResponse,
} from '@/types';

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Mock Data
export const mockESGScores: ESGScores = {
  environmental: 82,
  social: 74,
  governance: 88,
  overall: 81,
};

export const mockEmissionTrend: EmissionTrendData[] = [
  { month: 'Jan', emissions: 450 },
  { month: 'Feb', emissions: 420 },
  { month: 'Mar', emissions: 430 },
  { month: 'Apr', emissions: 400 },
  { month: 'May', emissions: 380 },
  { month: 'Jun', emissions: 350 },
  { month: 'Jul', emissions: 360 },
  { month: 'Aug', emissions: 340 },
  { month: 'Sep', emissions: 320 },
  { month: 'Oct', emissions: 300 },
  { month: 'Nov', emissions: 290 },
  { month: 'Dec', emissions: 280 },
];

export const mockDepartmentRanking: DepartmentRanking[] = [
  { department: 'Sales', score: 78, trend: 'up' },
  { department: 'Manufacturing', score: 85, trend: 'up' },
  { department: 'Logistics', score: 72, trend: 'down' },
  { department: 'Corporate', score: 88, trend: 'stable' },
  { department: 'R&D', score: 91, trend: 'up' },
];

export const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'emission',
    title: 'Q3 Emissions Recorded',
    description: 'Manufacturing reported Q3 emissions: 390t CO2',
    timestamp: '2 hours ago',
    icon: '📊',
  },
  {
    id: '2',
    type: 'challenge',
    title: 'New Challenge Started',
    description: '"Carbon Reduction Sprint" by 47 employees',
    timestamp: '4 hours ago',
    icon: '🎯',
  },
  {
    id: '3',
    type: 'csr',
    title: 'Tree Plantation Activity',
    description: '23 employees joined "Tree Plantation" activity',
    timestamp: '1 day ago',
    icon: '🌱',
  },
  {
    id: '4',
    type: 'badge',
    title: 'Badge Unlocked',
    description: 'Aditi Rao earned "Green Advocate" badge',
    timestamp: '2 days ago',
    icon: '🏆',
  },
  {
    id: '5',
    type: 'audit',
    title: 'Q2 Audit Completed',
    description: 'Manufacturing Q2 Waste Audit by S. Nair - 3 minor issues',
    timestamp: '3 days ago',
    icon: '✓',
  },
];

export const mockEmissionGoals: EmissionData[] = [
  {
    id: '1',
    name: 'Reduce Fleet Emissions',
    department: 'Logistics',
    targetCO2: 500,
    currentCO2: 390,
    progress: 78,
    deadline: '2026-12-31',
    status: 'Active',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'Energy Efficiency Upgrade',
    department: 'Manufacturing',
    targetCO2: 800,
    currentCO2: 680,
    progress: 85,
    deadline: '2026-11-30',
    status: 'Active',
    createdAt: '2026-02-01',
  },
  {
    id: '3',
    name: 'Renewable Energy Installation',
    department: 'Corporate',
    targetCO2: 300,
    currentCO2: 150,
    progress: 50,
    deadline: '2026-09-30',
    status: 'Active',
    createdAt: '2026-03-10',
  },
];

export const mockCSRActivities: CSRActivity[] = [
  {
    id: '1',
    title: 'Tree Plantation',
    icon: '🌱',
    participantCount: 23,
    status: 'Open',
    points: 50,
    description: 'Join us in planting 100 trees in local communities',
    createdAt: '2026-06-15',
  },
  {
    id: '2',
    title: 'Community Cleanup',
    icon: '🧹',
    participantCount: 15,
    status: 'Open',
    points: 40,
    description: 'Clean up local parks and beaches',
    createdAt: '2026-06-20',
  },
  {
    id: '3',
    title: 'Education Initiative',
    icon: '📚',
    participantCount: 8,
    status: 'Evidence Required',
    points: 60,
    description: 'Teach underprivileged children basic skills',
    createdAt: '2026-05-01',
  },
];

export const mockActivityParticipations: ActivityParticipation[] = [
  {
    id: '1',
    employeeId: 'emp_001',
    employeeName: 'Aditi Rao',
    activityId: '1',
    activityTitle: 'Tree Plantation',
    proof: 'photo.jpg',
    points: 50,
    status: 'Pending',
    submittedAt: '2026-07-10',
  },
  {
    id: '2',
    employeeId: 'emp_002',
    employeeName: 'Raj Kumar',
    activityId: '2',
    activityTitle: 'Community Cleanup',
    proof: 'video.mp4',
    points: 40,
    status: 'Approved',
    submittedAt: '2026-07-08',
  },
];

export const mockAudits: Audit[] = [
  {
    id: '1',
    title: 'Q2 Waste Audit',
    department: 'Manufacturing',
    auditor: 'S. Nair',
    date: '2026-06-12',
    findings: '3 minor issues',
    status: 'Completed',
    severity: 'Low',
    createdAt: '2026-06-12',
  },
  {
    id: '2',
    title: 'Q2 Energy Audit',
    department: 'Corporate',
    auditor: 'M. Singh',
    date: '2026-06-15',
    findings: 'No major issues, 2 recommendations',
    status: 'Completed',
    severity: 'Low',
    createdAt: '2026-06-15',
  },
  {
    id: '3',
    title: 'Q3 Environmental Compliance',
    department: 'Logistics',
    auditor: 'P. Sharma',
    date: '2026-07-10',
    findings: 'In progress - initial findings show compliance',
    status: 'In Progress',
    severity: 'Medium',
    createdAt: '2026-07-10',
  },
];

export const mockComplianceIssues: ComplianceIssue[] = [
  {
    id: '1',
    issue: 'Missing MSDS sheets',
    severity: 'High',
    department: 'Manufacturing',
    status: 'Open',
    raisedFrom: '1',
    dueDate: '2026-08-12',
    createdAt: '2026-06-12',
  },
  {
    id: '2',
    issue: 'Energy documentation incomplete',
    severity: 'Medium',
    department: 'Corporate',
    status: 'In Progress',
    raisedFrom: '2',
    dueDate: '2026-08-15',
    createdAt: '2026-06-15',
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Carbon Reduction Sprint',
    xp: 100,
    difficulty: 'Medium',
    deadline: '2026-08-31',
    status: 'Active',
    description: 'Reduce department carbon footprint by 10%',
    participants: 47,
    createdAt: '2026-07-01',
  },
  {
    id: '2',
    title: 'Waste Reduction Challenge',
    xp: 80,
    difficulty: 'Easy',
    deadline: '2026-09-30',
    status: 'Active',
    description: 'Zero single-use plastics for 30 days',
    participants: 32,
    createdAt: '2026-07-05',
  },
  {
    id: '3',
    title: 'Green Team Building',
    xp: 150,
    difficulty: 'Hard',
    deadline: '2026-10-31',
    status: 'Draft',
    description: 'Organize sustainable team building event',
    participants: 0,
    createdAt: '2026-07-10',
  },
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Green Beginner',
    icon: '🌱',
    description: 'Complete your first sustainability activity',
    criteria: 'Participate in 1 CSR activity',
    color: '#10b981',
    isUnlocked: true,
    unlockedAt: '2026-05-15',
  },
  {
    id: '2',
    name: 'Carbon Saver',
    icon: '💨',
    description: 'Reduce emissions by 20%',
    criteria: 'Achieve 20% reduction in personal carbon footprint',
    color: '#3b82f6',
    isUnlocked: true,
    unlockedAt: '2026-06-01',
  },
  {
    id: '3',
    name: 'Challenge Master',
    icon: '🏆',
    description: 'Complete 5 challenges',
    criteria: 'Successfully complete 5 gamification challenges',
    color: '#f97316',
    isUnlocked: false,
  },
  {
    id: '4',
    name: 'Green Advocate',
    icon: '🌍',
    description: 'Become an ESG champion',
    criteria: 'Accumulate 500 XP points',
    color: '#a855f7',
    isUnlocked: false,
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, employeeId: 'emp_001', name: 'Aditi Rao', department: 'R&D', xp: 650, badges: 3, challenges: 8 },
  { rank: 2, employeeId: 'emp_002', name: 'Raj Kumar', department: 'Corporate', xp: 580, badges: 2, challenges: 6 },
  { rank: 3, employeeId: 'emp_003', name: 'Priya Sharma', department: 'Manufacturing', xp: 520, badges: 2, challenges: 5 },
  { rank: 4, employeeId: 'emp_004', name: 'Vikram Singh', department: 'Logistics', xp: 480, badges: 1, challenges: 4 },
  { rank: 5, employeeId: 'emp_005', name: 'Nisha Patel', department: 'Sales', xp: 420, badges: 1, challenges: 3 },
];

export const mockDepartments: Department[] = [
  {
    id: 'dept_001',
    name: 'Manufacturing',
    code: 'MFC',
    head: 'S. Nair',
    employees: 134,
    status: 'Active',
    createdAt: '2025-01-01',
  },
  {
    id: 'dept_002',
    name: 'Logistics',
    code: 'LOG',
    head: 'R. Gupta',
    employees: 98,
    status: 'Active',
    createdAt: '2025-01-01',
  },
  {
    id: 'dept_003',
    name: 'Corporate',
    code: 'COR',
    head: 'M. Desai',
    employees: 45,
    status: 'Active',
    createdAt: '2025-01-01',
  },
  {
    id: 'dept_004',
    name: 'R&D',
    code: 'RND',
    head: 'P. Sharma',
    employees: 67,
    status: 'Active',
    createdAt: '2025-01-01',
  },
  {
    id: 'dept_005',
    name: 'Sales',
    code: 'SAL',
    head: 'V. Chopra',
    employees: 89,
    status: 'Active',
    createdAt: '2025-01-01',
  },
];

// API Service Functions (Mock implementations)
export const apiService = {
  // ESG Scores
  getESGScores: async (): Promise<ApiResponse<ESGScores>> => {
    return { success: true, data: mockESGScores };
  },

  // Emissions
  getEmissionTrend: async (): Promise<ApiResponse<EmissionTrendData[]>> => {
    return { success: true, data: mockEmissionTrend };
  },

  getDepartmentRanking: async (): Promise<ApiResponse<DepartmentRanking[]>> => {
    return { success: true, data: mockDepartmentRanking };
  },

  getEmissionGoals: async (): Promise<ApiResponse<EmissionData[]>> => {
    return { success: true, data: mockEmissionGoals };
  },

  // Dashboard
  getRecentActivities: async (): Promise<ApiResponse<RecentActivity[]>> => {
    return { success: true, data: mockRecentActivities };
  },

  // CSR & Social
  getCSRActivities: async (): Promise<ApiResponse<CSRActivity[]>> => {
    return { success: true, data: mockCSRActivities };
  },

  getActivityParticipations: async (): Promise<ApiResponse<ActivityParticipation[]>> => {
    return { success: true, data: mockActivityParticipations };
  },

  // Governance
  getAudits: async (): Promise<ApiResponse<Audit[]>> => {
    return { success: true, data: mockAudits };
  },

  getComplianceIssues: async (): Promise<ApiResponse<ComplianceIssue[]>> => {
    return { success: true, data: mockComplianceIssues };
  },

  // Gamification
  getChallenges: async (): Promise<ApiResponse<Challenge[]>> => {
    return { success: true, data: mockChallenges };
  },

  getBadges: async (): Promise<ApiResponse<Badge[]>> => {
    return { success: true, data: mockBadges };
  },

  getLeaderboard: async (): Promise<ApiResponse<LeaderboardEntry[]>> => {
    return { success: true, data: mockLeaderboard };
  },

  // Settings & Configuration
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    return { success: true, data: mockDepartments };
  },
};

export default api;
