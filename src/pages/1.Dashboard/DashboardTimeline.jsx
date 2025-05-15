import React from "react";

const DashboardTimeline = () => {
  return (
    <div className="mb-6">
      {/* Heading */}
      <div className="font-medium text-base mb-1 ml-1">Timeline (in Days)</div>
      {/* Timeline Bar */}
      <div className="w-full bg-white rounded border border-gray-200 h-8 flex items-center overflow-hidden relative">
        {/* Dark segment (absolute) */}
        <div className="absolute bg-[#23293B] h-full w-1 left-[18px]"></div>
        {/* Gray segment (absolute) */}
        <div className="absolute bg-gray-400 h-full w-[76px] left-[26px]"></div>
        {/* Teal segment (absolute) */}
        <div className="absolute bg-teal-700 h-full w-[124px] left-[106px]"></div>
      </div>
    </div>
  );
};

export default DashboardTimeline;
