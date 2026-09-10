import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import { Loader2, FileQuestion } from 'lucide-react';
import { useGetStudentResearchRequests } from '../../store/tanstackStore/services/queries';

const statusColors = {
  PENDING: 'text-amber-700 bg-amber-100',
  BEING_PROCESSED: 'text-blue-700 bg-blue-100',
  IN_REVIEW: 'text-purple-700 bg-purple-100',
  CONCLUDED: 'text-green-700 bg-green-100',
};

const DashboardRecentResearchRequests = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetStudentResearchRequests();
  
  const requests = data?.requests || [];
  // Get the most recent 3 requests to fit cleanly in dashboard cards
  const recentRequests = requests.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Research Requests</span>
        </div>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-[#25369B]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Research Requests</span>
        </div>
        <div className="flex items-center justify-center h-32 text-red-500 text-sm">
          Failed to load requests
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Research Requests</span>
        <button
          className="px-3 md:px-4 py-1.5 bg-[#25369B] text-white text-sm font-medium rounded-md hover:bg-[#1d285c] transition-colors"
          onClick={() => navigate('/requests')}
        >
          View All
        </button>
      </div>
      
      {recentRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <FileQuestion className="w-10 h-10 text-gray-300 mb-2" />
          <div className="text-gray-500 text-sm mb-2">No research requests yet</div>
          <button 
            className="px-4 py-1.5 bg-[#25369B] text-white text-xs font-medium rounded-md hover:bg-[#1d285c]"
            onClick={() => navigate('/requests/submit')}
          >
            Make a Request
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 overflow-y-auto flex-1 min-h-0">
          {recentRequests.map((request) => (
            <div 
              key={request.id} 
              onClick={() => navigate('/requests')}
              className="flex items-start justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-gray-50/70 p-1.5 -mx-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight truncate">
                  {request.requestType}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${statusColors[request.status] || 'text-gray-700 bg-gray-100'}`}>
                    {(request.status || 'PENDING').replace(/_/g, ' ')}
                  </span>
                  {request.decision && (
                    <span className="text-xs text-gray-500 truncate">
                      • {request.decision}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap pt-0.5">
                {request.submittedAt && isValid(new Date(request.submittedAt)) 
                  ? format(new Date(request.submittedAt), 'MMM d') 
                  : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRecentResearchRequests; 