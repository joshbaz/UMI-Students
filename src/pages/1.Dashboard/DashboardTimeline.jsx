import React, { useMemo } from "react";
import { useGetStudentProfile } from "../../store/tanstackStore/services/queries";

const DashboardTimeline = () => {
  const { data: studentData, isLoading } = useGetStudentProfile();
  
  const timelineData = useMemo(() => {
    if (!studentData?.student) return null;
    
    const student = studentData.student;
    const enrollmentDate = student.createdAt ? new Date(student.createdAt) : new Date();
    const expectedCompletionDate = student.expectedCompletionDate ? new Date(student.expectedCompletionDate) : null;
    const currentDate = new Date();
    
    // Calculate total days since enrollment
    const totalDays = Math.ceil((currentDate - enrollmentDate) / (1000 * 60 * 60 * 24));
    
    // Calculate expected total days if completion date is set
    const expectedDays = expectedCompletionDate 
      ? Math.ceil((expectedCompletionDate - enrollmentDate) / (1000 * 60 * 60 * 24))
      : null;
    
    // Calculate progress percentage
    const progressPercentage = expectedDays 
      ? Math.min((totalDays / expectedDays) * 100, 100)
      : (totalDays / 1095) * 100; // Default 3 years if no completion date
    
    // Get current status for color coding
    const currentStatus = student.statuses?.[0];
    const statusColor = currentStatus?.definition?.color || "#23293B";
    
    return {
      totalDays,
      expectedDays,
      progressPercentage,
      statusColor,
      enrollmentDate,
      expectedCompletionDate,
      isOverdue: expectedDays && totalDays > expectedDays
    };
  }, [studentData]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="font-medium text-base mb-1 ml-1">Timeline (in Days)</div>
        <div className="w-full bg-gray-200 rounded border border-gray-200 h-8 flex items-center overflow-hidden animate-pulse">
          <div className="bg-gray-300 h-full w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="mb-6">
        <div className="font-medium text-base mb-1 ml-1">Timeline (in Days)</div>
        <div className="w-full bg-white rounded border border-gray-200 h-8 flex items-center overflow-hidden">
          <div className="text-gray-500 text-sm px-4">No timeline data available</div>
        </div>
      </div>
    );
  }

  const { totalDays, expectedDays, progressPercentage, statusColor, enrollmentDate, expectedCompletionDate, isOverdue } = timelineData;

  return (
    <div className="mb-6">
      {/* Heading with progress info */}
      <div className="flex items-center justify-between mb-1">
        <div className="font-medium text-base ml-1">Timeline (in Days)</div>
        <div className="text-sm text-gray-600">
          {totalDays} {expectedDays && `of ${expectedDays} days`} 
          {isOverdue && (
            <span className="text-red-600 ml-1">
              (Overdue by {totalDays - expectedDays} days)
            </span>
          )}
        </div>
      </div>
      
      {/* Timeline Bar */}
      <div className="w-full bg-white rounded border border-gray-200 h-8 flex items-center overflow-hidden relative">
        {/* Progress bar */}
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${Math.min(progressPercentage, 100)}%`,
            backgroundColor: isOverdue ? "#EF4444" : statusColor,
            opacity: 0.8
          }}
        ></div>
        
        {/* Expected completion marker */}
        {expectedDays && (
          <div 
            className="absolute top-0 h-full w-1 bg-gray-600 opacity-70"
            style={{ left: "100%" }}
            title={`Expected completion: ${expectedCompletionDate?.toLocaleDateString()}`}
          ></div>
        )}
        
        {/* Current position indicator */}
        <div 
          className="absolute top-1 h-6 w-1 bg-gray-800"
          style={{ left: `${Math.min(progressPercentage, 100)}%` }}
          title={`Current position: ${totalDays} days`}
        ></div>
      </div>
      
      {/* Timeline info */}
      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span>Started: {enrollmentDate.toLocaleDateString()}</span>
        <span>
          {expectedCompletionDate 
            ? `Expected: ${expectedCompletionDate.toLocaleDateString()}`
            : "No completion date set"
          }
        </span>
      </div>
    </div>
  );
};

export default DashboardTimeline;
