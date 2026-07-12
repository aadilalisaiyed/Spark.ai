// src/lib/api.ts - Updated with correct backend routes
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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(endpoint, { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`API Error [GET ${endpoint}]:`, error);
      if (axios.isAxiosError(error)) {
        return { 
          success: false, 
          error: error.response?.data?.message || error.message 
        };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  },

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(endpoint, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`API Error [POST ${endpoint}]:`, error);
      if (axios.isAxiosError(error)) {
        return { 
          success: false, 
          error: error.response?.data?.message || error.message 
        };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  },

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(endpoint, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`API Error [PUT ${endpoint}]:`, error);
      if (axios.isAxiosError(error)) {
        return { 
          success: false, 
          error: error.response?.data?.message || error.message 
        };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(endpoint);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`API Error [DELETE ${endpoint}]:`, error);
      if (axios.isAxiosError(error)) {
        return { 
          success: false, 
          error: error.response?.data?.message || error.message 
        };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  },

  // Dashboard APIs - Check your backend for actual endpoint names
  getESGScores: () => apiService.get<ESGScores>('/dashboard/scores'),
  getEmissionTrend: (months?: number) => 
    apiService.get<EmissionTrendData[]>('/dashboard/emissions-trend', months ? { months } : undefined),
  getDepartmentRanking: () => 
    apiService.get<DepartmentRanking[]>('/dashboard/department-rankings'),
  getRecentActivities: () => 
    apiService.get<RecentActivity[]>('/dashboard/recent-activity'),
  getKeyGoals: () => 
    apiService.get<EmissionData[]>('/environmental/goals'),

  // Environmental APIs
  getEmissionGoals: () => 
    apiService.get<EmissionData[]>('/environmental/goals'),
  createEmissionGoal: (data: Partial<EmissionData>) => 
    apiService.post<EmissionData>('/environmental/goals', data),
  updateEmissionGoal: (id: string, data: Partial<EmissionData>) => 
    apiService.put<EmissionData>(`/environmental/goals/${id}`, data),
  deleteEmissionGoal: (id: string) => 
    apiService.delete(`/environmental/goals/${id}`),

  // Social/CSR APIs
  getCSRActivities: () => 
    apiService.get<CSRActivity[]>('/social/activities'),
  getActivityParticipations: () => 
    apiService.get<ActivityParticipation[]>('/social/participations'),

  // Governance APIs
  getAudits: () => apiService.get<Audit[]>('/governance/audits'),
  createAudit: (data: Partial<Audit>) => 
    apiService.post<Audit>('/governance/audits', data),
  getComplianceIssues: () => 
    apiService.get<ComplianceIssue[]>('/governance/compliance-issues'),

  // Gamification APIs
  getChallenges: () => apiService.get<Challenge[]>('/gamification/challenges'),
  joinChallenge: (challengeId: string) => 
    apiService.post(`/gamification/challenges/${challengeId}/join`),
  getBadges: () => apiService.get<Badge[]>('/gamification/badges'),
  getLeaderboard: () => 
    apiService.get<LeaderboardEntry[]>('/gamification/leaderboard'),

  // Settings APIs
  getDepartments: () => apiService.get<Department[]>('/settings/departments'),
  createDepartment: (data: Partial<Department>) => 
    apiService.post<Department>('/settings/departments', data),
  updateDepartment: (id: string, data: Partial<Department>) => 
    apiService.put<Department>(`/settings/departments/${id}`, data),
  deleteDepartment: (id: string) => 
    apiService.delete(`/settings/departments/${id}`),
};

export default api;