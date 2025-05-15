import React from 'react';
import { Icon } from '@iconify/react';

const notifications = [
  {
    title: 'Proposal Submission Delayed',
    subtitle: 'Submission overdue by 7 days',
    time: '15:23:42PM',
  },
  {
    title: 'Proposal Review Delayed',
    subtitle: 'No reviewers assigned yet',
    time: '15:23:42PM',
  },
  {
    title: 'Proposal Review Pending Reminder',
    subtitle: 'Review overdue by 4 days',
    time: '15:23:42PM',
  },
  {
    title: 'Proposal Review Pending Reminder',
    subtitle: 'Review overdue by 4 days',
    time: '15:23:42PM',
  },
  {
    title: 'Proposal Review Pending Reminder',
    subtitle: 'Review overdue by 4 days',
    time: '15:23:42PM',
  },
  {
    title: 'Proposal Review Pending Reminder',
    subtitle: 'Review overdue by 4 days',
    time: '15:23:42PM',
  },
  {
    title: 'Proposal Review Pending Reminder',
    subtitle: 'Review overdue by 4 days',
    time: '15:23:42PM',
  },
];

const DashboardRecentNotifications = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <span className="font-semibold text-lg md:text-xl">Recent Notifications</span>
        <button className="flex items-center gap-2 px-3 md:px-4 py-1 bg-[#25369B] text-white rounded-md text-base font-medium hover:bg-[#1d285c] transition">
          View More
          <span className="flex flex-col ml-1">
            <Icon icon="mdi:chevron-up" className="w-4 h-4" />
            <Icon icon="mdi:chevron-down" className="w-4 h-4 -mt-1" />
          </span>
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {notifications.map((notif, idx) => (
          <div key={idx} className="flex items-start justify-between py-2 md:py-3">
            <div>
              <div className="font-semibold text-gray-900 text-base md:text-lg leading-tight">{notif.title}</div>
              <div className="text-gray-500 text-xs md:text-sm">{notif.subtitle}</div>
            </div>
            <span className="text-xs md:text-sm text-gray-400 ml-2 whitespace-nowrap">{notif.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentNotifications;
