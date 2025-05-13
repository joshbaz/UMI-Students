import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed on the left */}
      <div className="fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;