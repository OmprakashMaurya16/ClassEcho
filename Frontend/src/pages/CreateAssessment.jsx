import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaculty } from '../context/FacultyContext';
import { useAssessment } from '../context/AssessmentContext';
import { assessmentQuestions } from '../utils/assessmentQuestions';
import Sidebar from '../components/Sidebar';
import { Plus, CheckCircle, Circle, BookOpen, Send } from 'lucide-react';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { createAssessment } = useAssessment();
  
  const facultyId = window.localStorage.getItem("facultyId");
  const facultyName = window.localStorage.getItem("facultyName");
  const { facultyList } = useFaculty();
  const currentFaculty = facultyList.find(f => f.id === facultyId);
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: 'Pre-semester assessment to evaluate student understanding',
  });
  
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);

  const subjects = currentFaculty?.subjectsTaught || [];
  const availableQuestions = formData.subject 
    ? (assessmentQuestions[formData.subject] || assessmentQuestions["Default"])
    : [];

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({ ...prev, subject }));
    setSelectedQuestions([]);
    setShowQuestions(true);
  };

  const toggleQuestion = (question) => {
    setSelectedQuestions(prev => {
      const exists = prev.find(q => q.id === question.id);
      if (exists) {
        return prev.filter(q => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const selectAllQuestions = () => {
    setSelectedQuestions([...availableQuestions]);
  };

  const handleCreate = () => {
    if (!formData.title.trim()) {
      alert('Please enter assessment title');
      return;
    }
    
    if (!formData.subject) {
      alert('Please select a subject');
      return;
    }
    
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }

    const assessmentId = createAssessment({
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      facultyId,
      facultyName,
      questions: selectedQuestions,
      totalQuestions: selectedQuestions.length,
    });

    navigate(`/faculty/assessment/${assessmentId}/conduct`);
  };

  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 md:ml-60 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Create Pre-Semester Assessment
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Select questions for oral assessment - then conduct the test with students
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {/* Basic Info */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Assessment Details</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Pre-Semester ML Concepts Test"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects.map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubjectChange(subject)}
                      className={`p-3 md:p-4 border-2 rounded-lg text-left transition-all ${
                        formData.subject === subject
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {formData.subject === subject ? (
                          <CheckCircle className="text-blue-600" size={18} />
                        ) : (
                          <Circle className="text-gray-400" size={18} />
                        )}
                        <span className="font-medium text-sm md:text-base">{subject}</span>
                      </div>
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handleSubjectChange('Default')}
                    className={`p-3 md:p-4 border-2 rounded-lg text-left transition-all ${
                      formData.subject === 'Default'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {formData.subject === 'Default' ? (
                        <CheckCircle className="text-blue-600" size={18} />
                      ) : (
                        <Circle className="text-gray-400" size={18} />
                      )}
                      <span className="font-medium text-sm md:text-base">General Teaching</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Question Selection */}
          {showQuestions && availableQuestions.length > 0 && (
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 mb-4 md:mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Select Questions</h2>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    {selectedQuestions.length} of {availableQuestions.length} questions selected
                  </p>
                </div>
                <button
                  onClick={selectAllQuestions}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm md:text-base font-medium transition-colors"
                >
                  Select All
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {availableQuestions.map((question, index) => {
                  const isSelected = selectedQuestions.find(q => q.id === question.id);
                  
                  return (
                    <div
                      key={question.id}
                      onClick={() => toggleQuestion(question)}
                      className={`p-4 md:p-6 border-2 rounded-lg md:rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="mt-1">
                          {isSelected ? (
                            <CheckCircle className="text-blue-600" size={20} />
                          ) : (
                            <Circle className="text-gray-400" size={20} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                              {question.topic}
                            </span>
                            <span className="text-xs md:text-sm font-medium text-gray-600">
                              Question {index + 1}
                            </span>
                          </div>
                          
                          <p className="text-base md:text-lg font-medium text-gray-900 mb-3">
                            {question.question}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded-lg text-sm ${
                                  optIndex === question.correctAnswer
                                    ? 'bg-green-100 text-green-900 font-medium'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 justify-end">
            <button
              onClick={() => navigate('/faculty-dashboard')}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!formData.title || !formData.subject || selectedQuestions.length === 0}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm md:text-base transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Create & Start Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessment;
