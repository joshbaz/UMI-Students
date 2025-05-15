import React from 'react';
import DashboardTimeline from './DashboardTimeline';
import DashboardStatusReport from './DashboardStatusReport';
import DashboardDirectMessages from './DashboardDirectMessages';
import DashboardRecentNotifications from './DashboardRecentNotifications';

const Dashboard = () => {
  // For demo, use a static last login date/time
  const lastLogin = '08-09-2024 15:23:42PM';

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-400">Last login : {lastLogin}</span>
      </div>
      {/* Timeline */}
      <DashboardTimeline />
      {/* Two columns below timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
        {/* Left column: Status Report + Direct Messages */}
        <div className="flex flex-col gap-4 h-full w-full">
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 h-full min-h-[260px] w-full">
            <DashboardStatusReport />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 h-full min-h-[220px] w-full">
            <DashboardDirectMessages />
          </div>
        </div>
        {/* Right column: Recent Notifications */}
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 h-full min-h-[500px] flex flex-col w-full">
          <DashboardRecentNotifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
