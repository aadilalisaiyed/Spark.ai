'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Building2, FolderTree, Settings2, Bell, Shield, 
  Users, Globe, Palette, Database, Key, Mail,
  Search, Plus, Edit, Trash2, Save, X, Check,
  ChevronDown, ChevronRight, MoreHorizontal, 
  AlertTriangle, CheckCircle2, Clock, History,
  Download, Upload, RefreshCw, Eye, EyeOff,
  Lock, Unlock, Copy, ExternalLink, Info,
  UserPlus, UserCheck, UserX, Filter, Sliders,
  RotateCcw, Zap, Star, Bookmark, Loader,
  ArrowUpRight, ArrowDownRight, Activity,
  Smartphone, Monitor, Moon, Sun, Wifi,
  Cloud, HardDrive, ShieldAlert, Fingerprint,
  FileText, Image, Video, Music, Package,
  Tag, Hash, Link2, AtSign, Phone, MapPin,
  Calendar, Clock3, Timer, Hourglass
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  headEmail: string;
  parentDeptId: string | null;
  employees: number;
  status: 'Active' | 'Inactive' | 'Restructuring';
  budget: string;
  location: string;
  createdAt: string;
  esgScore: number;
}

interface Category {
  id: string;
  name: string;
  type: 'emission' | 'social' | 'governance' | 'waste' | 'energy';
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  usageCount: number;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'config';
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Manufacturing',
    code: 'MFG',
    head: 'John Smith',
    headEmail: 'john.smith@company.com',
    parentDeptId: null,
    employees: 245,
    status: 'Active',
    budget: '$12.5M',
    location: 'Building A, Floor 1-3',
    createdAt: '2020-03-15',
    esgScore: 78,
  },
  {
    id: '2',
    name: 'Supply Chain',
    code: 'SCM',
    head: 'Sarah Johnson',
    headEmail: 'sarah.j@company.com',
    parentDeptId: null,
    employees: 180,
    status: 'Active',
    budget: '$8.2M',
    location: 'Building B, Floor 2',
    createdAt: '2020-06-01',
    esgScore: 85,
  },
  {
    id: '3',
    name: 'Logistics',
    code: 'LOG',
    head: 'Mike Chen',
    headEmail: 'mike.chen@company.com',
    parentDeptId: '2',
    employees: 95,
    status: 'Active',
    budget: '$4.5M',
    location: 'Warehouse District',
    createdAt: '2021-01-10',
    esgScore: 72,
  },
  {
    id: '4',
    name: 'Quality Control',
    code: 'QC',
    head: 'Emily Brown',
    headEmail: 'emily.brown@company.com',
    parentDeptId: '1',
    employees: 45,
    status: 'Active',
    budget: '$2.1M',
    location: 'Building A, Floor 4',
    createdAt: '2021-03-20',
    esgScore: 91,
  },
  {
    id: '5',
    name: 'Research & Development',
    code: 'RND',
    head: 'David Park',
    headEmail: 'david.park@company.com',
    parentDeptId: null,
    employees: 120,
    status: 'Restructuring',
    budget: '$15.8M',
    location: 'Innovation Center',
    createdAt: '2019-09-01',
    esgScore: 65,
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Direct Emissions', type: 'emission', description: 'Scope 1 emissions from owned sources', icon: '🏭', color: '#ef4444', isActive: true, usageCount: 234 },
  { id: '2', name: 'Energy Consumption', type: 'energy', description: 'Electricity and fuel usage tracking', icon: '⚡', color: '#f59e0b', isActive: true, usageCount: 567 },
  { id: '3', name: 'Water Usage', type: 'emission', description: 'Water consumption and recycling', icon: '💧', color: '#3b82f6', isActive: true, usageCount: 189 },
  { id: '4', name: 'Employee Training', type: 'social', description: 'ESG training and awareness programs', icon: '📚', color: '#8b5cf6', isActive: true, usageCount: 432 },
  { id: '5', name: 'Board Diversity', type: 'governance', description: 'Board composition and diversity metrics', icon: '👥', color: '#06b6d4', isActive: false, usageCount: 56 },
];

const mockAuditLogs: AuditLog[] = [
  { id: '1', action: 'Department Created', user: 'Admin', timestamp: '2025-01-05 14:30', details: 'Created Logistics department', type: 'create' },
  { id: '2', action: 'Settings Updated', user: 'Sarah Johnson', timestamp: '2025-01-04 09:15', details: 'Enabled auto-emission calculation', type: 'config' },
  { id: '3', action: 'Category Deleted', user: 'Admin', timestamp: '2025-01-03 16:45', details: 'Removed obsolete waste category', type: 'delete' },
  { id: '4', action: 'Department Modified', user: 'Mike Chen', timestamp: '2025-01-02 11:20', details: 'Updated Supply Chain head', type: 'update' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const [toggles, setToggles] = useState({
    autoEmission: true,
    requireEvidence: false,
    autoBadge: true,
    emailAlerts: true,
    twoFactorAuth: false,
    dataEncryption: true,
    publicProfile: false,
    auditTrail: true,
    apiAccess: false,
    darkMode: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailDigest: 'daily',
    pushNotifications: true,
    slackIntegration: false,
    teamsIntegration: true,
    reportFrequency: 'weekly',
    alertThreshold: 'medium',
  });

  useEffect(() => {
    setAnimateItems(true);
    const timer = setTimeout(() => setAnimateItems(false), 100);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  const toggleSetting = useCallback((key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    // Simulate save
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    setShowDeleteConfirm(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, []);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'departments', label: 'Departments', icon: Building2, count: departments.length },
    { id: 'categories', label: 'Categories', icon: FolderTree, count: categories.length },
    { id: 'config', label: 'ESG Config', icon: Settings2, count: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: 3 },
    { id: 'security', label: 'Security', icon: Shield, count: null },
    { id: 'audit', label: 'Audit Log', icon: History, count: auditLogs.length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return { bg: '#16a34a15', text: '#16a34a', border: '#16a34a30' };
      case 'Inactive': return { bg: '#6b728015', text: '#6b7280', border: '#6b728030' };
      case 'Restructuring': return { bg: '#f59e0b15', text: '#f59e0b', border: '#f59e0b30' };
      default: return { bg: '#6b728015', text: '#6b7280', border: '#6b728030' };
    }
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
        checked 
          ? 'bg-blue-600 shadow-lg shadow-blue-600/20' 
          : 'bg-gray-700 hover:bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Settings2 className="text-blue-400" size={28} />
                Settings & Configuration
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage your ESG platform settings</p>
            </div>
            
            <div className="flex items-center gap-3">
              {saveSuccess && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm animate-slideIn">
                  <CheckCircle2 size={16} />
                  Changes saved successfully
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                <Save size={16} />
                Save All Changes
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  <Icon size={16} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              
              <div className="flex gap-2">
                {selectedItems.length > 0 && (
                  <>
                    <button className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl text-sm hover:bg-orange-500/20 transition-colors flex items-center gap-2">
                      <Edit size={14} />
                      Edit ({selectedItems.length})
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm('bulk')}
                      className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Department
                </button>
              </div>
            </div>

            {/* Departments Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/50">
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(filteredDepartments.map(d => d.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          checked={selectedItems.length === filteredDepartments.length && filteredDepartments.length > 0}
                          className="rounded border-gray-600 bg-gray-800 checked:bg-blue-600"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Head</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Parent Dept</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Employees</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ESG Score</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredDepartments.map((dept, idx) => {
                      const statusColors = getStatusColor(dept.status);
                      const isExpanded = expandedDept === dept.id;
                      
                      return (
                        <React.Fragment key={dept.id}>
                          <tr
                            className={`group transition-colors hover:bg-gray-800/50 ${
                              selectedItems.includes(dept.id) ? 'bg-blue-500/5' : ''
                            }`}
                            style={{
                              animationDelay: `${idx * 50}ms`,
                              animation: animateItems ? 'slideIn 0.5s ease-out forwards' : 'none',
                            }}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(dept.id)}
                                onChange={() => {
                                  setSelectedItems(prev =>
                                    prev.includes(dept.id)
                                      ? prev.filter(id => id !== dept.id)
                                      : [...prev, dept.id]
                                  );
                                }}
                                className="rounded border-gray-600 bg-gray-800 checked:bg-blue-600"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Building2 size={14} className="text-gray-500" />
                                  <span className="text-sm font-medium text-white">{dept.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{dept.code}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm text-gray-300">{dept.head}</p>
                                <p className="text-xs text-gray-500">{dept.headEmail}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-400">
                                {dept.parentDeptId 
                                  ? departments.find(d => d.id === dept.parentDeptId)?.name || 'Parent Dept'
                                  : '—'
                                }
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Users size={14} className="text-gray-500" />
                                <span className="text-sm text-gray-300">{dept.employees}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 max-w-[80px]">
                                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: `${dept.esgScore}%`,
                                        background: dept.esgScore >= 80 
                                          ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                          : dept.esgScore >= 60
                                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                          : 'linear-gradient(90deg, #ef4444, #f87171)',
                                      }}
                                    />
                                  </div>
                                </div>
                                <span className="text-sm font-medium text-gray-300">{dept.esgScore}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                                style={{
                                  color: statusColors.text,
                                  backgroundColor: statusColors.bg,
                                  borderColor: statusColors.border,
                                }}
                              >
                                {dept.status === 'Active' && <CheckCircle2 size={12} />}
                                {dept.status === 'Inactive' && <X size={12} />}
                                {dept.status === 'Restructuring' && <RefreshCw size={12} />}
                                {dept.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <ChevronRight
                                    size={16}
                                    className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                  />
                                </button>
                                <button
                                  onClick={() => setEditingItem(dept.id)}
                                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <Edit size={14} className="text-gray-400 hover:text-blue-400" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(dept.id)}
                                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded Details */}
                          {isExpanded && (
                            <tr key={`${dept.id}-expanded`}>
                              <td colSpan={8} className="px-6 py-4 bg-gray-800/30">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Location</p>
                                    <p className="text-sm text-white flex items-center gap-2">
                                      <MapPin size={14} className="text-gray-500" />
                                      {dept.location}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Budget</p>
                                    <p className="text-sm text-white">{dept.budget}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Created</p>
                                    <p className="text-sm text-white flex items-center gap-2">
                                      <Calendar size={14} className="text-gray-500" />
                                      {dept.createdAt}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="border-t border-gray-800 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing <span className="text-white font-medium">{filteredDepartments.length}</span> of{' '}
                  <span className="text-white font-medium">{departments.length}</span> departments
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium">
                    1
                  </button>
                  <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Building2 size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{departments.filter(d => d.status === 'Active').length}</p>
                    <p className="text-sm text-gray-400">Active Departments</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{departments.reduce((sum, d) => sum + d.employees, 0)}</p>
                    <p className="text-sm text-gray-400">Total Employees</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Activity size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(departments.reduce((sum, d) => sum + d.esgScore, 0) / departments.length)}%
                    </p>
                    <p className="text-sm text-gray-400">Average ESG Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                <Plus size={16} />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, idx) => (
                <div
                  key={category.id}
                  className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animation: animateItems ? 'slideUp 0.5s ease-out forwards' : 'none',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{category.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <span className="text-xs text-gray-400 uppercase">{category.type}</span>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={category.isActive}
                      onChange={() => {
                        setCategories(prev =>
                          prev.map(c =>
                            c.id === category.id ? { ...c, isActive: !c.isActive } : c
                          )
                        );
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Hash size={12} />
                      {category.usageCount} items
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit size={14} className="text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESG Configuration Tab */}
        {activeTab === 'config' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings2 size={20} className="text-blue-400" />
                ESG Configuration
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    key: 'autoEmission' as const,
                    title: 'Automatic Emission Calculation',
                    description: 'Calculate emissions automatically from activity logs and meter readings',
                    icon: Zap,
                  },
                  {
                    key: 'requireEvidence' as const,
                    title: 'Require Evidence for CSR Activities',
                    description: 'Mandatory photo, video, or document proof for CSR participation tracking',
                    icon: Image,
                  },
                  {
                    key: 'autoBadge' as const,
                    title: 'Auto-Award Badges',
                    description: 'Automatically issue achievement badges when completion criteria are met',
                    icon: Star,
                  },
                  {
                    key: 'emailAlerts' as const,
                    title: 'Compliance Alert Emails',
                    description: 'Send immediate email notifications for new compliance issues or violations',
                    icon: Mail,
                  },
                  {
                    key: 'auditTrail' as const,
                    title: 'Enable Audit Trail',
                    description: 'Log all system changes and user actions for compliance auditing',
                    icon: History,
                  },
                ].map((setting) => {
                  const Icon = setting.icon;
                  return (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-gray-600/50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg mt-0.5">
                          <Icon size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                            {setting.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{setting.description}</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={toggles[setting.key]}
                        onChange={() => toggleSetting(setting.key)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings Tab */}
        {activeTab === 'notifications' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Bell size={20} className="text-blue-400" />
                Notification Preferences
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Email Digest</label>
                    <select
                      value={notificationSettings.emailDigest}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailDigest: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Report Frequency</label>
                    <select
                      value={notificationSettings.reportFrequency}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, reportFrequency: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">Push Notifications</p>
                      <p className="text-xs text-gray-400">Receive real-time alerts on your device</p>
                    </div>
                    <ToggleSwitch
                      checked={notificationSettings.pushNotifications}
                      onChange={() => setNotificationSettings(prev => ({
                        ...prev,
                        pushNotifications: !prev.pushNotifications
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">Slack Integration</p>
                      <p className="text-xs text-gray-400">Send notifications to Slack channels</p>
                    </div>
                    <ToggleSwitch
                      checked={notificationSettings.slackIntegration}
                      onChange={() => setNotificationSettings(prev => ({
                        ...prev,
                        slackIntegration: !prev.slackIntegration
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">Teams Integration</p>
                      <p className="text-xs text-gray-400">Send notifications to Microsoft Teams</p>
                    </div>
                    <ToggleSwitch
                      checked={notificationSettings.teamsIntegration}
                      onChange={() => setNotificationSettings(prev => ({
                        ...prev,
                        teamsIntegration: !prev.teamsIntegration
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-blue-400" />
                Security Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Fingerprint size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={toggles.twoFactorAuth}
                    onChange={() => toggleSetting('twoFactorAuth')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Lock size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Data Encryption</p>
                      <p className="text-xs text-gray-400">Encrypt sensitive data at rest and in transit</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={toggles.dataEncryption}
                    onChange={() => toggleSetting('dataEncryption')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Globe size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Public Profile</p>
                      <p className="text-xs text-gray-400">Make your ESG data publicly accessible</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={toggles.publicProfile}
                    onChange={() => toggleSetting('publicProfile')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Key size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">API Access</p>
                      <p className="text-xs text-gray-400">Enable API access for external integrations</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={toggles.apiAccess}
                    onChange={() => toggleSetting('apiAccess')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <History size={20} className="text-blue-400" />
                  Audit Trail
                </h2>
                <p className="text-sm text-gray-400 mt-1">Track all system changes and user activities</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {auditLogs.map((log, idx) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-800/30 transition-colors"
                        style={{
                          animationDelay: `${idx * 100}ms`,
                          animation: animateItems ? 'slideIn 0.5s ease-out forwards' : 'none',
                        }}
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-white">{log.action}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300">{log.user}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{log.timestamp}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{log.details}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            log.type === 'create' ? 'bg-green-500/10 text-green-400' :
                            log.type === 'update' ? 'bg-blue-500/10 text-blue-400' :
                            log.type === 'delete' ? 'bg-red-500/10 text-red-400' :
                            'bg-purple-500/10 text-purple-400'
                          }`}>
                            {log.type === 'create' && <Plus size={12} />}
                            {log.type === 'update' && <Edit size={12} />}
                            {log.type === 'delete' && <Trash2 size={12} />}
                            {log.type === 'config' && <Settings2 size={12} />}
                            {log.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4 animate-slideUp">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete {showDeleteConfirm === 'bulk' ? `${selectedItems.length} items` : 'this item'}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm === 'bulk') {
                      setDepartments(prev => prev.filter(d => !selectedItems.includes(d.id)));
                      setSelectedItems([]);
                    } else {
                      handleDelete(showDeleteConfirm);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}