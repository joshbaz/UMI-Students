import React, { useState } from 'react';
import { ArrowLeft, Star, BookOpen, Users, FileText, GraduationCap, MessageSquare, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitStudentEvaluation } from '../../store/tanstackStore/services/queries';

const StarRating = ({ value, onChange, label, required = true }) => {
  const [hover, setHover] = useState(0);

  const levels = [
    { value: 1, label: 'Very Dissatisfied', color: 'text-red-500' },
    { value: 2, label: 'Dissatisfied', color: 'text-orange-500' },
    { value: 3, label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, label: 'Satisfied', color: 'text-green-400' },
    { value: 5, label: 'Very Satisfied', color: 'text-green-500' }
  ];

  const handleRatingChange = (rating) => {
    const level = levels[rating - 1];
    const enumValue = level.label.toUpperCase().replace(/ /g, '_');
    onChange(enumValue);
  };

  const getCurrentValue = () => {
    if (!value) return 0;
    const level = levels.find(l => l.label.toUpperCase().replace(/ /g, '_') === value);
    return level ? level.value : 0;
  };

  const currentValue = getCurrentValue();
  const currentLevel = levels[currentValue - 1];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-colors ${
              star <= (hover || currentValue) 
                ? levels[star - 1]?.color || 'text-gray-300'
                : 'text-gray-300'
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRatingChange(star)}
          >
            <Star 
              className={`w-6 h-6 ${
                star <= (hover || currentValue) ? 'fill-current' : ''
              }`} 
            />
          </button>
        ))}
        {currentLevel && (
          <span className="text-sm text-gray-600 ml-2">
            {currentLevel.label}
          </span>
        )}
      </div>
    </div>
  );
};

const EvaluationForm = ({ evaluation, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    trigger: evaluation?.trigger || '',
    researchTrainingSatisfaction: '',
    supervisionSatisfaction: '',
    proposalDefenseSatisfaction: '',
    dissertationExaminationSatisfaction: '',
    researchTrainingComments: '',
    supervisionComments: '',
    proposalDefenseComments: '',
    dissertationExaminationComments: '',
    overallComments: '',
    suggestions: ''
  });

  const [errors, setErrors] = useState({});
  
  const submitMutation = useSubmitStudentEvaluation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.researchTrainingSatisfaction) {
      newErrors.researchTrainingSatisfaction = 'Research training satisfaction is required';
    }
    if (!formData.supervisionSatisfaction) {
      newErrors.supervisionSatisfaction = 'Supervision satisfaction is required';
    }
    if (!formData.proposalDefenseSatisfaction) {
      newErrors.proposalDefenseSatisfaction = 'Proposal defense satisfaction is required';
    }
    if (evaluation?.trigger === 'POST_VIVA' && !formData.dissertationExaminationSatisfaction) {
      newErrors.dissertationExaminationSatisfaction = 'Dissertation examination satisfaction is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to submit evaluation');
    }
  };

  const sections = [
    {
      id: 'research-training',
      icon: BookOpen,
      title: 'Research Training',
      description: 'Quality and effectiveness of research training provided',
      ratingField: 'researchTrainingSatisfaction',
      commentField: 'researchTrainingComments'
    },
    {
      id: 'supervision',
      icon: Users,
      title: 'Supervision',
      description: 'Quality and support from your supervisor(s)',
      ratingField: 'supervisionSatisfaction',
      commentField: 'supervisionComments'
    },
    {
      id: 'proposal-defense',
      icon: FileText,
      title: 'Proposal Defense',
      description: 'Process and experience of proposal defense',
      ratingField: 'proposalDefenseSatisfaction',
      commentField: 'proposalDefenseComments'
    }
  ];

  if (evaluation?.trigger === 'POST_VIVA') {
    sections.push({
      id: 'dissertation-examination',
      icon: GraduationCap,
      title: 'Dissertation Examination',
      description: 'Process and experience of dissertation examination (viva)',
      ratingField: 'dissertationExaminationSatisfaction',
      commentField: 'dissertationExaminationComments'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {evaluation?.title || 'Research Process Evaluation'}
            </h1>
            <p className="text-gray-600 mt-1">
              Please rate your satisfaction with each aspect of the research process
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Evaluation Sections */}
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {section.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{section.description}</p>
                  </div>

                  {/* Rating */}
                  <div>
                    <StarRating
                      value={formData[section.ratingField]}
                      onChange={(value) => handleInputChange(section.ratingField, value)}
                      label="How satisfied are you with this aspect?"
                      required
                    />
                    {errors[section.ratingField] && (
                      <p className="text-red-500 text-sm mt-1">{errors[section.ratingField]}</p>
                    )}
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      value={formData[section.commentField]}
                      onChange={(e) => handleInputChange(section.commentField, e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Share your specific thoughts about ${section.title.toLowerCase()}...`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Overall Feedback */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Overall Feedback</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Comments
                </label>
                <textarea
                  value={formData.overallComments}
                  onChange={(e) => handleInputChange('overallComments', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your overall experience with the research process..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggestions for Improvement
                </label>
                <textarea
                  value={formData.suggestions}
                  onChange={(e) => handleInputChange('suggestions', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What suggestions do you have to improve the research process for future students?"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                All required fields must be completed before submission
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Evaluation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm; 