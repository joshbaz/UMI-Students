import React, { useState } from 'react';
import { ClipboardList, Star, CheckCircle, AlertCircle, BookOpen, Users, GraduationCap, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useGetAvailableEvaluations, useGetStudentEvaluations } from '../../store/tanstackStore/services/queries';
import EvaluationForm from './EvaluationForm';

const Evaluations = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: availableData, isLoading: loadingAvailable } = useGetAvailableEvaluations();
  const { data: completedData, isLoading: loadingCompleted } = useGetStudentEvaluations();

  const availableEvaluations = availableData?.evaluations || [];
  const completedEvaluations = completedData?.evaluations || [];

  const handleStartEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedEvaluation(null);
  };

  const getSatisfactionIcon = (level) => {
    switch (level) {
      case 'VERY_SATISFIED':
        return <Star className="w-5 h-5 text-green-500 fill-current" />;
      case 'SATISFIED':
        return <Star className="w-5 h-5 text-green-400 fill-current" />;
      case 'NEUTRAL':
        return <Star className="w-5 h-5 text-yellow-500 fill-current" />;
      case 'DISSATISFIED':
        return <Star className="w-5 h-5 text-orange-500 fill-current" />;
      case 'VERY_DISSATISFIED':
        return <Star className="w-5 h-5 text-red-500 fill-current" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSatisfactionText = (level) => {
    switch (level) {
      case 'VERY_SATISFIED':
        return 'Very Satisfied';
      case 'SATISFIED':
        return 'Satisfied';
      case 'NEUTRAL':
        return 'Neutral';
      case 'DISSATISFIED':
        return 'Dissatisfied';
      case 'VERY_DISSATISFIED':
        return 'Very Dissatisfied';
      default:
        return 'N/A';
    }
  };

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'POST_PROPOSAL_DEFENSE':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'POST_VIVA':
        return <GraduationCap className="w-6 h-6 text-purple-500" />;
      default:
        return <ClipboardList className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTriggerTitle = (trigger) => {
    switch (trigger) {
      case 'POST_PROPOSAL_DEFENSE':
        return 'Post-Proposal Defense Evaluation';
      case 'POST_VIVA':
        return 'Post-Viva Evaluation';
      default:
        return 'Research Process Evaluation';
    }
  };

  if (showForm) {
    return (
      <EvaluationForm
        evaluation={selectedEvaluation}
        onClose={handleFormClose}
        onSuccess={() => {
          handleFormClose();
          toast.success('Evaluation submitted successfully!');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Research Process Evaluations</h1>
            <p className="text-gray-600 mt-1">
              Evaluate your satisfaction with different aspects of the research process
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Evaluations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Available Evaluations</h2>
          </div>

          {loadingAvailable ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : availableEvaluations.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No evaluations available at this time</p>
              <p className="text-sm text-gray-400 mt-1">
                Evaluations become available after proposal defense and viva completion
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableEvaluations.map((evaluation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    {getTriggerIcon(evaluation.trigger)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {evaluation.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {evaluation.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {evaluation.trigger === 'POST_PROPOSAL_DEFENSE' ? 'After Proposal Defense' : 'After Viva'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleStartEvaluation(evaluation)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Evaluation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Evaluations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">Completed Evaluations</h2>
          </div>

          {loadingCompleted ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : completedEvaluations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No completed evaluations yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Complete available evaluations to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {getTriggerIcon(evaluation.trigger)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {getTriggerTitle(evaluation.trigger)}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Submitted: {format(new Date(evaluation.submittedAt), 'PPP')}
                      </p>
                      
                      {/* Satisfaction Summary */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Research Training:</span>
                          <div className="flex items-center gap-1">
                            {getSatisfactionIcon(evaluation.researchTrainingSatisfaction)}
                            <span className="text-xs text-gray-500">
                              {getSatisfactionText(evaluation.researchTrainingSatisfaction)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Supervision:</span>
                          <div className="flex items-center gap-1">
                            {getSatisfactionIcon(evaluation.supervisionSatisfaction)}
                            <span className="text-xs text-gray-500">
                              {getSatisfactionText(evaluation.supervisionSatisfaction)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Proposal Defense:</span>
                          <div className="flex items-center gap-1">
                            {getSatisfactionIcon(evaluation.proposalDefenseSatisfaction)}
                            <span className="text-xs text-gray-500">
                              {getSatisfactionText(evaluation.proposalDefenseSatisfaction)}
                            </span>
                          </div>
                        </div>
                        
                        {evaluation.dissertationExaminationSatisfaction && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Dissertation Exam:</span>
                            <div className="flex items-center gap-1">
                              {getSatisfactionIcon(evaluation.dissertationExaminationSatisfaction)}
                              <span className="text-xs text-gray-500">
                                {getSatisfactionText(evaluation.dissertationExaminationSatisfaction)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {evaluation.overallComments && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium text-gray-700">Overall Comments:</span>
                          <p className="text-gray-600 mt-1">{evaluation.overallComments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluations;