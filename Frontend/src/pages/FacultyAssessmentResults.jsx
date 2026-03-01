import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, AlertCircle, CheckCircle, XCircle, BookOpen, Lightbulb, Sparkles, BarChart3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { improvementSuggestions } from '../utils/assessmentQuestions';

const FacultyAssessmentResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    const storedResults = localStorage.getItem('facultyAssessmentResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      navigate('/faculty/self-assessment');
    }
  }, []);
  
  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }
  
  const { score, total, percentage, answers, questions, topicScores, weakTopics, subject, timeTaken } = results;
  
  const getPerformanceLevel = () => {
    if (percentage >= 80) return { level: 'Excellent', color: 'green', message: 'Outstanding performance! You have a strong grasp of the subject.' };
    if (percentage >= 60) return { level: 'Good', color: 'blue', message: 'Good job! There are some areas where you can improve.' };
    if (percentage >= 40) return { level: 'Fair', color: 'yellow', message: 'Fair performance. Consider reviewing the weak areas.' };
    return { level: 'Needs Improvement', color: 'red', message: 'Additional preparation needed. Focus on the weak topics.' };
  };
  
  const performance = getPerformanceLevel();
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 ml-60 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Assessment Results
                </h1>
                <p className="text-gray-600">{subject || 'General Teaching'} Assessment</p>
              </div>
              <button
                onClick={() => navigate('/faculty-dashboard')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8 py-10">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-10">
            <div className="grid grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy size={32} className="text-white" />
                </div>
                <p className="text-blue-100 text-sm mb-1">Your Score</p>
                <p className="text-4xl font-bold">{score}/{total}</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 size={32} className="text-white" />
                </div>
                <p className="text-blue-100 text-sm mb-1">Percentage</p>
                <p className="text-4xl font-bold">{percentage}%</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <p className="text-blue-100 text-sm mb-1">Performance</p>
                <p className="text-2xl font-bold">{performance.level}</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-blue-100 text-sm mb-1">Time Taken</p>
                <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
              </div>
            </div>
            
            <div className={`mt-6 p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20`}>
              <p className="text-center text-lg">{performance.message}</p>
            </div>
          </div>
          
          {/* Topic-wise Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Topic-wise Performance</h2>
            <div className="space-y-4">
              {Object.entries(topicScores).map(([topic, scores]) => {
                const percentage = (scores.correct / scores.total) * 100;
                const isWeak = percentage < 60;
                
                return (
                  <div key={topic} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold text-gray-900`}>{topic}</span>
                        {isWeak && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            Needs Improvement
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {scores.correct}/{scores.total} correct ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage >= 80 ? 'bg-green-500' :
                          percentage >= 60 ? 'bg-blue-500' :
                          percentage >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* AI-Powered Improvement Suggestions */}
          {weakTopics.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI-Powered Improvement Suggestions</h2>
                  <p className="text-gray-600">Personalized recommendations based on your performance</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {weakTopics.map((weakTopic, index) => {
                  const suggestions = improvementSuggestions[weakTopic.topic] || improvementSuggestions["Teaching Methods"];
                  
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 border border-purple-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="text-red-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{weakTopic.topic}</h3>
                          <p className="text-sm text-gray-600">
                            Score: {weakTopic.correct}/{weakTopic.total} ({weakTopic.percentage.toFixed(0)}%)
                          </p>
                        </div>
                      </div>
                      
                      {/* Teaching Tips */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="text-yellow-600" size={18} />
                          <h4 className="font-semibold text-gray-900">Teaching Strategies</h4>
                        </div>
                        <ul className="space-y-2 ml-6">
                          {suggestions.tips.map((tip, idx) => (
                            <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Resources */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="text-blue-600" size={18} />
                          <h4 className="font-semibold text-gray-900">Recommended Resources</h4>
                        </div>
                        <ul className="space-y-2 ml-6">
                          {suggestions.resources.map((resource, idx) => (
                            <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-green-600 mt-1">📚</span>
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Detailed Question Review */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`border-2 rounded-xl p-6 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="text-white" size={20} />
                        ) : (
                          <XCircle className="text-white" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            {question.topic}
                          </span>
                          <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-4">{question.question}</p>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = question.correctAnswer === optIndex;
                            
                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-100'
                                    : isUserAnswer
                                      ? 'border-red-500 bg-red-100'
                                      : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <CheckCircle className="text-green-600" size={16} />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle className="text-red-600" size={16} />
                                  )}
                                  <span className={`text-sm ${
                                    isCorrectAnswer ? 'font-semibold text-green-900' :
                                    isUserAnswer ? 'font-semibold text-red-900' :
                                    'text-gray-700'
                                  }`}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => {
                localStorage.removeItem('facultyAssessmentResults');
                navigate('/faculty/self-assessment');
              }}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Take Another Assessment
            </button>
            <button
              onClick={() => navigate('/faculty-dashboard')}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAssessmentResults;
