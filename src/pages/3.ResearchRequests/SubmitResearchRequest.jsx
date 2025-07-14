import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useCreateStudentResearchRequest, useGetStudentProfile } from '../../store/tanstackStore/services/queries';

const SubmitResearchRequest = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const requestTypeRef = useRef(null);
  const {
    mutate: createRequest,
    isPending,
    error,
  } = useCreateStudentResearchRequest();

  // Get current student profile to access supervisors
  const { data: studentProfile } = useGetStudentProfile();
  const currentSupervisors = studentProfile?.student?.supervisors || [];

  React.useEffect(() => {
    if (requestTypeRef.current) {
      requestTypeRef.current.focus();
    }
  }, []);

  // Dynamic request types based on current supervisors
  const requestTypes = [
    {
      value: 'Change of Supervisor',
      label: 'Change of Supervisor',
      fields: [
        { 
          name: 'currentSupervisor', 
          label: 'Current Supervisor', 
          type: 'select', 
          options: currentSupervisors.map(s => `${s.title || ''} ${s.name}`.trim()) 
        },
        { name: 'reason', label: 'Reason', type: 'textarea' },
      ],
    },
    // {
    //   value: 'Request for Proposal Defense Scheduling',
    //   label: 'Request for Proposal Defense Scheduling',
    //   fields: [
    //     { name: 'info', label: '', type: 'info', text: "The default selection is 'External'. To assign an Internal, simply change the option." },
    //     { name: 'currentDate', label: 'Current Date', type: 'readonly', value: format(new Date(), 'dd-MM-yyyy hh:mm a') },
    //     { name: 'preferredDateRange', label: 'Preferred Date Range (select week)', type: 'select', options: ['27/11/2025 - 1/12/2025'] },
    //     { name: 'preferredTime', label: 'Preferred Time Range (select hour slot)', type: 'select', options: ['Morning', 'Afternoon'] },
    //     { name: 'reason', label: 'Reason', type: 'textarea' },
    //   ],
    // },
    {
      value: 'Other',
      label: 'Other',
      fields: [
        { name: 'otherTitle', label: 'Request Title', type: 'input' },
        { name: 'reason', label: 'Description/Reason', type: 'textarea' },
      ],
    },
  ];

  const typeObj = requestTypes.find((t) => t.value === selectedType);
  const fields = typeObj ? typeObj.fields : [];

  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate required fields (input, textarea, select except info/readonly)
  const validateFields = () => {
    if (!selectedType) return false;
    for (const field of fields) {
      if ((field.type === 'input' || field.type === 'textarea' || field.type === 'select') && !form[field.name]) {
        setValidationError(`${field.label || 'Field'} is required.`);
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    createRequest(
      {
        requestType: selectedType,
        formData: form,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setForm({});
          setSelectedType('');
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/requests');
          }, 1500);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/requests')}
            className="inline-flex items-center px-4 py-2 bg-[#23388F] text-white rounded-lg gap-2 hover:bg-blue-600"
            disabled={isPending}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-lg font-medium text-gray-900">
            Submit Request
          </span>
        </div>
      </div>
      {/* Toast/Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle2 className="w-5 h-5" />
          Request submitted successfully!
        </div>
      )}
      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 text-sm">{error.message || 'Failed to submit request. Please try again.'}</div>
          </div>
        )}
        {validationError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-700 text-sm">{validationError}</div>
          </div>
        )}
        <form onSubmit={handleSend} className="space-y-6 max-w-2xl">
          <fieldset disabled={isPending} className="space-y-6">
            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Request Type</label>
              <select
                ref={requestTypeRef}
                className="w-full border rounded px-3 py-2 text-sm"
                value={selectedType}
                onChange={e => {
                  setSelectedType(e.target.value);
                  setForm({});
                  setValidationError('');
                }}
                required
              >
                <option value="">Select request type...</option>
                {requestTypes.map(rt => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
            {/* Dynamic Fields */}
            {selectedType && fields.map(field => {
              if (field.type === 'select') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={form[field.name] || ''}
                      onChange={e => handleFormChange(field.name, e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (field.type === 'textarea') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows={4}
                      value={form[field.name] || ''}
                      onChange={e => handleFormChange(field.name, e.target.value)}
                      required
                    />
                  </div>
                );
              }
              if (field.type === 'readonly') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input
                      className="w-full border rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                      value={field.value}
                      readOnly
                    />
                  </div>
                );
              }
              if (field.type === 'info') {
                return (
                  <div key={field.name} className="text-xs text-gray-500 mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    {field.text}
                  </div>
                );
              }
              if (field.type === 'input') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={form[field.name] || ''}
                      onChange={e => handleFormChange(field.name, e.target.value)}
                      required
                    />
                  </div>
                );
              }
              return null;
            })}
            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => navigate('/requests')} 
                className="px-6 py-2 rounded text-gray-600 hover:bg-gray-100 border border-gray-300"
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 rounded bg-[#6c2bd7] text-white font-medium hover:bg-[#4b1fa3] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isPending || !selectedType}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Submitting...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default SubmitResearchRequest; 