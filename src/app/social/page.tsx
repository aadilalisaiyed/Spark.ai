'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

interface ActivityCard {
  id: string;
  icon: string;
  title: string;
  joined: number;
}

interface EmployeeParticipation {
  id: string;
  employee: string;
  activity: string;
  proof: string;
  points: number;
  approval: 'Pending' | 'Approved' | 'Rejected';
}

export default function Social() {
  const [activeTab, setActiveTab] = useState('activities');
  const [activityCards, setActivityCards] = useState<ActivityCard[]>([]);
  const [participations, setParticipations] = useState<EmployeeParticipation[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [activitiesRes, participationsRes] = await Promise.all([
        apiService.getCSRActivities(),
        apiService.getActivityParticipations(),
      ]);

      if (activitiesRes.success && activitiesRes.data) {
        setActivityCards(
          activitiesRes.data.map((activity) => ({
            id: activity.id,
            icon: '🌱',
            title: activity.title,
            joined: activity.participantCount,
          }))
        );
      }

      if (participationsRes.success && participationsRes.data) {
        setParticipations(
          participationsRes.data.map((participation) => ({
            id: participation.id,
            employee: participation.employeeName,
            activity: participation.activityTitle,
            proof: participation.proof || 'No proof attached',
            points: participation.points,
            approval: participation.status,
          }))
        );
      }
    };

    loadData();
  }, []);

  const getApprovalBadgeColor = (approval: string) => {
    switch (approval) {
      case 'Approved':
        return 'border-green-500 text-green-400';
      case 'Pending':
        return 'border-yellow-500 text-yellow-400';
      default:
        return 'border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      {/* Sub-Navigation Tabs */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[
          { id: 'activities', label: 'CSR Activities' },
          { id: 'participation', label: 'Employee Participation' },
          { id: 'diversity', label: 'Diversity Dashboard' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CSR Activities Section */}
      {activeTab === 'activities' && (
        <>
          {/* New Activity Button */}
          <div className="mb-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              + New Activity
            </button>
          </div>

          {/* Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {activityCards.map((activity) => (
              <div
                key={activity.id}
                className="bg-gray-800/80 border border-blue-500 rounded-lg p-6 flex flex-col"
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{activity.icon}</div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-100 mb-4">{activity.title}</h3>

                {/* Joined Count */}
                <p className="text-sm text-gray-400 mb-2">{activity.joined} joined</p>

                {/* Evidence Required */}
                <p className="text-xs text-gray-500 mb-4">Evidence Required</p>

                {/* Join Button */}
                <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full">
                  Join
                </button>
              </div>
            ))}
          </div>

          {/* Employee Participation Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Employee Participation: approval queue</h2>

            {/* Table */}
            <div className="bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Header */}
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-800">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Activity/Challenge</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Proof</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Approval</th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    {participations.map((participation, index) => (
                      <tr
                        key={participation.id}
                        className={`border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${
                          index === participations.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        {/* Employee */}
                        <td className="px-6 py-4 text-sm text-gray-100 font-medium">
                          {participation.employee}
                        </td>

                        {/* Activity */}
                        <td className="px-6 py-4 text-sm text-gray-400">{participation.activity}</td>

                        {/* Proof */}
                        <td className="px-6 py-4 text-sm text-gray-400">
                          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                            {participation.proof}
                          </a>
                        </td>

                        {/* Points */}
                        <td className="px-6 py-4 text-sm text-gray-100 font-medium">
                          {participation.points}
                        </td>

                        {/* Approval Badge */}
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full border font-medium text-xs ${getApprovalBadgeColor(
                              participation.approval
                            )}`}
                          >
                            {participation.approval}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors order-2 sm:order-1">
                Approve
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors order-1 sm:order-2">
                Reject
              </button>
            </div>
          </div>
        </>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== 'activities' && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">
            Content for Employee Participation and Diversity Dashboard coming soon...
          </p>
        </div>
      )}
    </div>
  );
}
