// User & Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar?: string;
  joinDate: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  parentDeptId?: string;
  employees: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

// Environmental Types
export interface EmissionData {
  id: string;
  name: string;
  department: string;
  targetCO2: number; // in tonnes
  currentCO2: number; // in tonnes
  progress: number; // percentage 0-100
  deadline: string;
  status: 'Active' | 'Completed' | 'Paused';
  createdAt: string;
}

export interface EmissionTrendData {
  month: string;
  emissions: number;
}

// Social Types
export interface CSRActivity {
  id: string;
  title: string;
  icon: string;
  participantCount: number;
  status: 'Open' | 'Evidence Required' | 'Closed';
  points: number;
  description: string;
  createdAt: string;
}

export interface ActivityParticipation {
  id: string;
  employeeId: string;
  employeeName: string;
  activityId: string;
  activityTitle: string;
  proof: string;
  points: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

// Governance Types
export interface Audit {
  id: string;
  title: string;
  department: string;
  auditor: string;
  date: string;
  findings: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  severity?: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export interface ComplianceIssue {
  id: string;
  issue: string;
  severity: 'Low' | 'Medium' | 'High';
  department: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  raisedFrom: string; // Audit ID
  dueDate: string;
  createdAt: string;
}

// Gamification Types
export interface Challenge {
  id: string;
  title: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  deadline: string;
  status: 'Draft' | 'Active' | 'Under Review' | 'Completed' | 'Archived';
  description: string;
  participants: number;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: string;
  color: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  employeeId: string;
  name: string;
  department: string;
  xp: number;
  badges: number;
  challenges: number;
}

// Dashboard Types
export interface ESGScores {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
}

export interface DepartmentRanking {
  department: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RecentActivity {
  id: string;
  type: 'emission' | 'csr' | 'audit' | 'challenge' | 'badge';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// Report Types
export interface ReportConfig {
  dateRange: { start: string; end: string };
  department?: string;
  module?: string;
  employee?: string;
  challenge?: string;
  category?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'Environmental' | 'Social' | 'Governance' | 'ESG Summary';
  generatedAt: string;
  period: string;
  data: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
