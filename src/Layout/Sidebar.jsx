import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const mainNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'mdi:view-dashboard', iconActive: 'mdi:view-dashboard', color: 'text-[#23398B]' },
  { name: 'Students Management', path: '/students', icon: 'mdi:account-school', color: 'text-gray-400' },
  { name: 'Grades', path: '/grades', icon: 'mdi:calendar-month', color: 'text-gray-400' },
  { name: 'Direct Messages', path: '/direct-messages', icon: 'mdi:message-text', color: 'text-gray-400', badge: 20 },
];
const otherNavItems = [
  { name: 'Notifications', path: '/notifications', icon: 'mdi:cube', color: 'text-gray-400' },
  { name: 'Settings', path: '/settings', icon: 'mdi:cog', color: 'text-gray-400' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col min-h-screen h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex items-start">
          <img src="/Logo2.png" alt="UMI Logo" className="h-12 w-auto" />
        </div>
      </div>
      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-3 border-y border-[#E5E7EB]">
        <img src="/avatar.jpg" alt="User avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
        <div className="flex flex-col items-start">
          <span className="font-semibold text-gray-800 text-xs leading-tight">Joshua Kimbareeba</span>
          <span className="text-xs text-gray-500 leading-tight">IT Administrator</span>
        </div>
      </div>
      {/* Main Activities */}
      <div className="px-4 pt-4">
        <div className="text-xs text-gray-400 font-semibold mb-2">Main Activities</div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs transition-colors ${
                    navActive || isActive
                      ? 'bg-blue-50 text-[#23398B] font-semibold'
                      : 'text-gray-900 hover:bg-blue-50'
                  }`
                }
              >
                <Icon
                  icon={item.icon}
                  className={`text-xl ${isActive ? 'text-[#23398B]' : 'text-gray-400'}`}
                />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto border border-[#7DD3FC] text-[#0369A1] text-sm px-2 py-0.5 rounded-full font-semibold bg-white">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      {/* Other options */}
      <div className="px-4 pt-6">
        <div className="text-xs text-gray-400 font-semibold mb-2">Other options</div>
        <nav className="space-y-1">
          {otherNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs transition-colors ${
                    navActive || isActive
                      ? 'bg-blue-50 text-[#23398B] font-semibold'
                      : 'text-gray-900 hover:bg-blue-50'
                  }`
                }
              >
                <Icon
                  icon={item.icon}
                  className={`text-2xl ${isActive ? 'text-[#23398B]' : 'text-gray-400'}`}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      {/* Logout */}
      <div className="mt-auto px-4 py-4  border-t border-[#E5E7EB]">
        <button className="w-full flex items-center justify-between px-4 py-2 text-red-600 cursor-pointer hover:bg-red-50 font-medium text-sm transition-colors">
          <span>Logout</span>
          <Icon icon="mdi:logout" className="text-base" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;