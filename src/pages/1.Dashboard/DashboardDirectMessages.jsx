import React from 'react';
import { Icon } from '@iconify/react';

const messages = [
  {
    sender: 'Prof. Susan Atieno',
    message: 'Hi Prof. Mwangi, hope your afternoon... ',
    time: '15:23:42PM',
    initial: 'A',
  },
  {
    sender: 'Prof. Susan Atieno',
    message: 'Hi Prof. Mwangi, hope your afternoon... ',
    time: '15:23:42PM',
    initial: 'A',
  },
  {
    sender: 'Prof. Susan Atieno',
    message: 'Hi Prof. Mwangi, hope your afternoon... ',
    time: '15:23:42PM',
    initial: 'A',
  },
];

const DashboardDirectMessages = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg md:text-xl font-semibold">Direct Messages</span>
        <button className="flex items-center gap-2 px-3 md:px-4 py-1 bg-[#25369B] text-white rounded-md text-base font-medium hover:bg-[#1d285c] transition">
          View More
          <span className="flex flex-col ml-1">
            <Icon icon="mdi:chevron-up" className="w-4 h-4" />
            <Icon icon="mdi:chevron-down" className="w-4 h-4 -mt-1" />
          </span>
        </button>
      </div>
      <div className="space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-base">{msg.initial}</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight">{msg.sender}</div>
                <div className="text-gray-500 text-xs md:text-sm truncate max-w-[120px] md:max-w-[160px]">{msg.message}</div>
              </div>
            </div>
            <span className="text-xs md:text-sm text-gray-400 ml-2 whitespace-nowrap">{msg.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardDirectMessages;
