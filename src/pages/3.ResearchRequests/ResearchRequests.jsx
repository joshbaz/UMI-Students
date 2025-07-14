/**
 * This edit updates the page to use real API data instead of mock data
 * and adds proper loading states and error handling.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useGetStudentResearchRequests } from '../../store/tanstackStore/services/queries';

const statusColors = {
  PENDING: 'text-yellow-700 bg-yellow-100 border-yellow-500',
  BEING_PROCESSED: 'text-blue-700 bg-blue-100 border-blue-500',
  IN_REVIEW: 'text-purple-700 bg-purple-100 border-purple-500',
  CONCLUDED: 'text-green-700 bg-green-100 border-green-500',
};

const ResearchRequests = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Use React Query hook
  const { data, isLoading, error, refetch } = useGetStudentResearchRequests();
  const requests = data?.requests || [];
  const stats = data?.stats || {
    requested: 0,
    pending: 0,
    beingProcessed: 0,
    concluded: 0,
  };

  // Filtered data
  const filtered = requests.filter(
    (r) =>
      r.requestType.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase()) ||
      (r.decision && r.decision.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading research requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafbfc] p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">{error.message || 'Failed to load research requests. Please try again.'}</div>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#6c2bd7] text-white rounded-lg hover:bg-[#4b1fa3]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Research Requests</h2>
        <span className="text-xs text-gray-500">Last login : {format(new Date(), 'dd-MM-yyyy hh:mm:ssa')}</span>
      </div>

      {/* Progress Cards */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Progress</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.requested}</span>
            <span className="text-gray-500 text-sm">Total Requests</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.pending}</span>
            <span className="text-gray-500 text-sm">Pending</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.beingProcessed}</span>
            <span className="text-gray-500 text-sm">Being Processed</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.concluded}</span>
            <span className="text-gray-500 text-sm">Concluded</span>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by request type, status, or decision..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <button 
            onClick={() => navigate('/requests/submit')} 
            className="ml-2 px-4 py-2 bg-[#6c2bd7] text-white text-sm font-medium rounded-lg hover:bg-[#4b1fa3]"
          >
            Make a Request
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-[#f9fafd]">
            <tr>
              <th className="px-4 py-3 text-left text-[#111827] text-opacity-90 font-semibold text-sm">Request Type</th>
              <th className="px-4 py-3 text-left text-[#111827] text-opacity-90 font-semibold text-sm">Date Submitted</th>
              <th className="px-4 py-3 text-left text-[#111827] text-opacity-90 font-semibold text-sm">Status</th>
              <th className="px-4 py-3 text-left text-[#111827] text-opacity-90 font-semibold text-sm">Decision</th>
              <th className="px-4 py-3 text-left text-[#111827] text-opacity-90 font-semibold text-sm">Response Date</th>
              <th className="px-4 py-3 text-left text-[#111827] text-opacity-90 font-semibold text-sm"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No research requests found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.requestType}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {format(new Date(row.submittedAt), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`border ${statusColors[row.status] || ''} px-2 py-1 rounded text-xs font-medium`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.decision || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.responseDate ? format(new Date(row.responseDate), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button 
                      className="px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 text-[#6c2bd7] font-medium text-xs"
                      onClick={() => { setSelected(row); setModalOpen(true); }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination and results info */}
        <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100 bg-white text-xs text-gray-500">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} Results
          </span>
          <div className="flex items-center gap-1">
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            {Array.from({ length: Math.ceil(filtered.length / pageSize) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded text-xs ${p === page ? 'bg-[#f3e8ff] text-[#6c2bd7] font-semibold' : 'text-gray-500'}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / pageSize), p + 1))}
              disabled={page === Math.ceil(filtered.length / pageSize) || filtered.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {modalOpen && selected && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">{selected.requestType}</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Date Submitted</div>
              <div className="font-medium">{format(new Date(selected.submittedAt), 'dd/MM/yyyy')}</div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <div className="font-medium">
                <span className={`border ${statusColors[selected.status] || ''} px-2 py-1 rounded text-xs font-medium`}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {selected.requestType === 'Change of Supervisor' && selected.formData?.currentSupervisor && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Supervisor</div>
                <div className="font-medium">{selected.formData.currentSupervisor}</div>
              </div>
            )}

            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Reason</div>
              <div className="bg-gray-50 rounded p-3 text-sm">
                {selected.formData?.reason || 'No reason provided'}
              </div>
            </div>

            {selected.decision && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Decision</div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  {selected.decision}
                </div>
              </div>
            )}

            {selected.responseDate && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Response Date</div>
                <div className="font-medium">{format(new Date(selected.responseDate), 'dd/MM/yyyy')}</div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchRequests;