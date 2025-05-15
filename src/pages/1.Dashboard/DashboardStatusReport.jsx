import React from 'react'

const DashboardStatusReport = () => {
  return (
    <div className="">
      <div className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Status Report</div>
      {/* Current Status */}
      <div className="mb-3 md:mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base md:text-lg font-semibold text-gray-700">Current Status</span>
          <span className="px-3 py-1 border border-teal-600 text-teal-700 rounded-lg text-xs md:text-sm font-medium bg-teal-50">Normal Progress</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Assigned On</span>
          <span>Assigned By</span>
        </div>
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-gray-700">15:23:42PM</span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-xs">T</span>
            <span className="text-indigo-800 font-medium">Tumusiiime Mugisa</span>
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 my-2 md:my-3"></div>
      {/* Previous Status */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-base md:text-lg font-semibold text-gray-400">Previous Status</span>
          <span className="px-3 py-1 border border-gray-400 text-gray-500 rounded-lg text-xs md:text-sm font-medium bg-gray-50">Workshop</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Assigned On</span>
          <span>Assigned By</span>
        </div>
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-gray-400">15:23:42PM</span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-xs">T</span>
            <span className="text-indigo-800 font-medium">Tumusiiime Mugisa</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashboardStatusReport
