import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="bg-gray-50 flex h-screen">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1  min-h-screen overflow-y-auto">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;