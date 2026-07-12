'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FileText, Download, Calendar, Filter, Search, 
  ChevronDown, ChevronRight, Eye, Share2, Clock,
  BarChart3, PieChart, TrendingUp, TrendingDown,
  Zap, Star, Bookmark, MoreHorizontal, RefreshCw,
  Play, Pause, RotateCcw, CheckCircle2, AlertCircle,
  X, Plus, Minus, Maximize2, Minimize2, Copy,
  Settings, Info, HelpCircle, Sparkles, Loader,
  FileSpreadsheet, FileOutput, Printer, Mail,
  Globe, Building2, Users, Leaf, Shield,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  lastGenerated: string;
  popularity: number;
  isFavorite: boolean;
  estimatedTime: string;
}

interface FilterState {
  dateRange: string;
  department: string;
  module: string;
  employee: string;
  challenge: string;
  esgCategory: string;
  format: string;
  frequency: string;
  comparison: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  size: string;
  status: 'Ready' | 'Generating' | 'Failed';
  format: 'PDF' | 'Excel' | 'CSV';
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Environmental Impact',
    description: 'Comprehensive emissions tracking, energy consumption, and sustainability metrics with trend analysis',
    icon: '🌱',
    category: 'Environmental',
    lastGenerated: '2 hours ago',
    popularity: 94,
    isFavorite: true,
    estimatedTime: '2-3 min',
  },
  {
    id: '2',
    name: 'Social Responsibility',
    description: 'Employee engagement, DEI metrics, community impact, and CSR activities overview',
    icon: '👥',
    category: 'Social',
    lastGenerated: '1 day ago',
    popularity: 78,
    isFavorite: false,
    estimatedTime: '3-4 min',
  },
  {
    id: '3',
    name: 'Governance & Compliance',
    description: 'Audit findings, regulatory compliance status, and corporate governance metrics',
    icon: '⚖️',
    category: 'Governance',
    lastGenerated: '3 days ago',
    popularity: 82,
    isFavorite: true,
    estimatedTime: '2-3 min',
  },
  {
    id: '4',
    name: 'ESG Summary Dashboard',
    description: 'High-level overview of all ESG metrics with comparative analysis and trend indicators',
    icon: '📊',
    category: 'Summary',
    lastGenerated: '5 hours ago',
    popularity: 96,
    isFavorite: true,
    estimatedTime: '4-5 min',
  },
  {
    id: '5',
    name: 'Carbon Footprint Analysis',
    description: 'Detailed breakdown of Scope 1, 2, and 3 emissions with reduction recommendations',
    icon: '🏭',
    category: 'Environmental',
    lastGenerated: '1 week ago',
    popularity: 88,
    isFavorite: false,
    estimatedTime: '3-5 min',
  },
  {
    id: '6',
    name: 'Supplier ESG Scorecard',
    description: 'Evaluate supplier sustainability performance and risk assessment matrix',
    icon: '🔗',
    category: 'Governance',
    lastGenerated: '2 days ago',
    popularity: 71,
    isFavorite: false,
    estimatedTime: '3-4 min',
  },
  {
    id: '7',
    name: 'Waste Management Report',
    description: 'Track waste reduction initiatives, recycling rates, and circular economy metrics',
    icon: '♻️',
    category: 'Environmental',
    lastGenerated: '4 days ago',
    popularity: 65,
    isFavorite: false,
    estimatedTime: '2-3 min',
  },
  {
    id: '8',
    name: 'Employee Wellness Index',
    description: 'Health and safety metrics, wellness program participation, and satisfaction scores',
    icon: '💪',
    category: 'Social',
    lastGenerated: '6 days ago',
    popularity: 73,
    isFavorite: false,
    estimatedTime: '3-4 min',
  },
];

const generatedReports: GeneratedReport[] = [
  { id: 'g1', name: 'Q4 Environmental Report', type: 'Environmental', generatedAt: '2025-01-05 14:30', size: '2.4 MB', status: 'Ready', format: 'PDF' },
  { id: 'g2', name: 'Annual ESG Summary', type: 'Summary', generatedAt: '2025-01-03 09:15', size: '5.1 MB', status: 'Ready', format: 'PDF' },
  { id: 'g3', name: 'Supplier Audit Results', type: 'Governance', generatedAt: '2025-01-04 16:45', size: '1.8 MB', status: 'Ready', format: 'Excel' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('builder');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedReports, setSavedReports] = useState<GeneratedReport[]>(generatedReports);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'last30',
    department: 'all',
    module: 'all',
    employee: 'all',
    challenge: 'all',
    esgCategory: 'all',
    format: 'pdf',
    frequency: 'once',
    comparison: 'none',
  });

  const tabs = [
    { id: 'env', label: 'Environmental', icon: Leaf, count: 24 },
    { id: 'social', label: 'Social', icon: Users, count: 18 },
    { id: 'gov', label: 'Governance', icon: Shield, count: 15 },
    { id: 'summary', label: 'ESG Summary', icon: BarChart3, count: 8 },
    { id: 'builder', label: 'Custom Builder', icon: Settings, count: null },
  ];

  useEffect(() => {
    setAnimateCards(true);
    const timer = setTimeout(() => setAnimateCards(false), 100);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const handleGenerateReport = useCallback(async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation with progress
    for (let i = 0; i <= 100; i += Math.random() * 15) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setGenerationProgress(Math.min(i, 100));
    }
    
    setGenerationProgress(100);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsGenerating(false);
    setSelectedTemplate(null);
    
    // Add to generated reports
    const template = reportTemplates.find(t => t.id === templateId);
    const newReport: GeneratedReport = {
      id: `g${Date.now()}`,
      name: `${template?.name} - ${new Date().toLocaleDateString()}`,
      type: template?.category || 'General',
      generatedAt: new Date().toLocaleString(),
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      status: 'Ready',
      format: filters.format.toUpperCase() as 'PDF' | 'Excel' | 'CSV',
    };
    
    setSavedReports(prev => [newReport, ...prev]);
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  }, [filters.format]);

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = {
    all: reportTemplates.length,
    Environmental: reportTemplates.filter(t => t.category === 'Environmental').length,
    Social: reportTemplates.filter(t => t.category === 'Social').length,
    Governance: reportTemplates.filter(t => t.category === 'Governance').length,
    Summary: reportTemplates.filter(t => t.category === 'Summary').length,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar with Advanced Features */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="text-blue-400" size={28} />
                Reports & Analytics
              </h1>
              <p className="text-gray-400 text-sm mt-1">Generate, customize, and export ESG reports</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Generated</p>
                  <p className="text-lg font-bold text-white">{savedReports.length}</p>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div className="text-center">
                  <p className="text-xs text-gray-400">Scheduled</p>
                  <p className="text-lg font-bold text-white">3</p>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div className="text-center">
                  <p className="text-xs text-gray-400">Templates</p>
                  <p className="text-lg font-bold text-white">{reportTemplates.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
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
                  {tab.count && (
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
        {/* Save Notification */}
        {showSaveNotification && (
          <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <CheckCircle2 size={20} />
              <span>Report generated successfully!</span>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <>
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                
                {/* Category Filters */}
                <div className="flex gap-2">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {category === 'all' ? 'All' : category}
                      <span className="ml-1 opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-gray-200 transition-colors"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Filters Panel with Animation */}
            <div className={`transition-all duration-500 overflow-hidden ${
              showFilters ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
            }`}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings size={18} />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={() => setFilters({
                      dateRange: 'last30',
                      department: 'all',
                      module: 'all',
                      employee: 'all',
                      challenge: 'all',
                      esgCategory: 'all',
                      format: 'pdf',
                      frequency: 'once',
                      comparison: 'none',
                    })}
                    className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="last7">Last 7 days</option>
                      <option value="last30">Last 30 days</option>
                      <option value="last90">Last 90 days</option>
                      <option value="year">This year</option>
                      <option value="custom">Custom range</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Department</label>
                    <select
                      value={filters.department}
                      onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="all">All Departments</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="logistics">Logistics</option>
                      <option value="hr">Human Resources</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Format</label>
                    <select
                      value={filters.format}
                      onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="csv">CSV Data</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Frequency</label>
                    <select
                      value={filters.frequency}
                      onChange={(e) => setFilters(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="once">One-time</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Cards Grid with Advanced Animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredTemplates.map((template, idx) => (
                <div
                  key={template.id}
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animation: animateCards ? 'slideUp 0.6s ease-out forwards' : 'none',
                  }}
                >
                  {/* Favorite Button */}
                  <button
                    className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle favorite logic
                    }}
                  >
                    <Star
                      size={16}
                      className={template.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}
                    />
                  </button>

                  <div className="p-6">
                    {/* Icon with Glow */}
                    <div className="relative mb-4">
                      <div className="text-5xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        {template.icon}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{template.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity size={12} />
                        <span>{template.popularity}% used</span>
                      </div>
                    </div>

                    {/* Generate Button with Loading State */}
                    <button
                      onClick={() => handleGenerateReport(template.id)}
                      disabled={isGenerating}
                      className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 overflow-hidden group/btn disabled:opacity-50"
                    >
                      {isGenerating && selectedTemplate === template.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader className="animate-spin" size={16} />
                          <span>Generating... {generationProgress}%</span>
                        </div>
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Zap size={16} />
                          Generate Report
                          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      )}
                      
                      {/* Progress Bar during generation */}
                      {isGenerating && selectedTemplate === template.id && (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Generated Reports Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Generated Reports</h2>
                  <p className="text-sm text-gray-400 mt-1">Your recently generated reports</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Download All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Report Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Generated</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Size</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {savedReports.map((report, idx) => (
                      <tr
                        key={report.id}
                        className="group hover:bg-gray-800/50 transition-colors"
                        style={{
                          animationDelay: `${idx * 100}ms`,
                          animation: 'slideIn 0.6s ease-out forwards',
                        }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                              {report.format === 'PDF' ? (
                                <FileText size={16} className="text-blue-400" />
                              ) : (
                                <FileSpreadsheet size={16} className="text-green-400" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-white">{report.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-400">{report.type}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-400">{report.generatedAt}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-400">{report.size}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                            <CheckCircle2 size={12} />
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Download">
                              <Download size={16} className="text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Share">
                              <Share2 size={16} className="text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="More">
                              <MoreHorizontal size={16} className="text-gray-400 hover:text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/30 transition-all group">
                <Mail size={18} className="text-gray-400 group-hover:text-blue-400" />
                <span className="text-sm text-gray-400 group-hover:text-white">Schedule Email Reports</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/30 transition-all group">
                <Bookmark size={18} className="text-gray-400 group-hover:text-blue-400" />
                <span className="text-sm text-gray-400 group-hover:text-white">Save as Template</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/30 transition-all group">
                <Globe size={18} className="text-gray-400 group-hover:text-blue-400" />
                <span className="text-sm text-gray-400 group-hover:text-white">Publish to Portal</span>
              </button>
            </div>
          </>
        )}

        {/* Other Tabs Content */}
        {activeTab !== 'builder' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="text-6xl mb-4">
                {tabs.find(t => t.id === activeTab)?.icon && (
                  <Leaf size={48} className="text-blue-400 mx-auto" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {tabs.find(t => t.id === activeTab)?.label} Reports
              </h3>
              <p className="text-gray-400 mb-6">
                Detailed {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} reporting and analytics coming soon
              </p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                Request Early Access
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}