import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { downloadDocumentService } from '../../store/tanstackStore/services/api';
import { useMutation } from '@tanstack/react-query';

const DocumentPreview = ({ document: documentRecord, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadMutation = useMutation({
    mutationFn: downloadDocumentService,
    onSuccess: (response, variables) => {
      // Use the original filename from the document record
      const filename = documentRecord.fileName || documentRecord.title || 'document';
      
      // Get the blob data from the response
      const data = response.data;
      
      console.log('Download response:', response);
      console.log('Document record:', documentRecord);
      console.log('Filename:', filename);
      console.log('Data type:', typeof data);
      console.log('Data size:', data?.size || data?.length);
      
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document downloaded successfully!');
    },
    onError: (error) => {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download document');
    }
  });

  const handleDownload = () => {
    setIsDownloading(true);
    downloadMutation.mutate({
      documentId: documentRecord.id,
      filename: documentRecord.fileName || documentRecord.title
    }, {
      onSettled: () => setIsDownloading(false)
    });
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'PROPOSAL':
        return 'bg-blue-100 text-blue-800';
      case 'DISSERTATION':
        return 'bg-green-100 text-green-800';
      case 'CHAPTER':
        return 'bg-purple-100 text-purple-800';
      case 'REVIEWED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'PROPOSAL':
        return 'Proposal';
      case 'DISSERTATION':
        return 'Dissertation';
      case 'CHAPTER':
        return 'Chapter';
      case 'REVIEWED':
        return 'Reviewed';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{documentRecord.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(documentRecord.type)}`}>
                  {getDocumentTypeLabel(documentRecord.type)}
                </span>
                {documentRecord.isReviewed && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Reviewed
                  </span>
                )}
              </div>
            </div>

            {documentRecord.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-sm text-gray-600">{documentRecord.description}</p>
              </div>
            )}

            {/* Document Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Upload Date</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(documentRecord.uploadedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              
              {documentRecord.uploadedBy && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Uploaded By</h4>
                  <p className="text-sm text-gray-600">{documentRecord.uploadedBy.name}</p>
                </div>
              )}

              {documentRecord.fileSize && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">File Size</h4>
                  <p className="text-sm text-gray-600">
                    {(documentRecord.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {documentRecord.fileType && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">File Type</h4>
                  <p className="text-sm text-gray-600">{documentRecord.fileType}</p>
                </div>
              )}
            </div>

            {/* Review Information */}
            {documentRecord.reviewedAt && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Review Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-1">Reviewed At</h5>
                    <p className="text-sm text-gray-600">
                      {format(new Date(documentRecord.reviewedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {documentRecord.reviewedBy && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-1">Reviewed By</h5>
                      <p className="text-sm text-gray-600">{documentRecord.reviewedBy.name}</p>
                    </div>
                  )}
                </div>
                {documentRecord.reviewComments && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">Review Comments</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {documentRecord.reviewComments}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview; 