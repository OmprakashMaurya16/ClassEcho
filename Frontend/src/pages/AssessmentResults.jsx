import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { improvementSuggestions } from '../utils/assessmentQuestions';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Users, TrendingUp, TrendingDown, Lightbulb, Award, AlertTriangle, CheckCircle, Copy, Link as LinkIcon, BookOpen, Sparkles } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { getAssessment, analyzeAssessment, closeAssessment } = useAssessment();
  
  const assessment = useMemo(() => getAssessment(assessmentId), [assessmentId, getAssessment]);
  const analysis = useMemo(() => analyzeAssessment(assessmentId), [assessmentId, analyzeAssessment]);
  
  const [copiedLink, setCopiedLink] = useState(false);

  if (!assessment) {
    return (
      <div className="flex">
        <Sidebar role="Faculty" />
        <div className="flex-1 ml-60 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Assessment not found</p>
          </div>
        </div>
      </div>
    );
  }

  const testLink = `${window.location.origin}/assessment/${assessmentId}/take`;

  const copyTestLink = () => {
    navigator.clipboard.writeText(testLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCloseAssessment = () => {
    if (confirm('Are you sure you want to close this assessment? Students will no longer be able to take the test.')) {
      closeAssessment(assessmentId);
    }
  };

  // Chart data
  const topicPerformanceData = {
    labels: analysis.topicAnalysis?.map(t => t.topic) || [],
    datasets: [{
      label: 'Success Rate (%)',
      data: analysis.topicAnalysis?.map(t => t.percentage) || [],
      backgroundColor: analysis.topicAnalysis?.map(t => 
        t.percentage >= 75 ? 'rgba(34, 197, 94, 0.8)' :
        t.percentage >= 60 ? 'rgba(59, 130, 246, 0.8)' :
        'rgba(239, 68, 68, 0.8)'
      ) || [],
    }]
  };

  const scoreDistributionData = {
    labels: ['Excellent (80-100%)', 'Good (60-79%)', 'Average (40-59%)', 'Below Average (<40%)'],
    datasets: [{
      data: [
        assessment.results.filter(r => r.score >= 80).length,
        assessment.results.filter(r => r.score >= 60 && r.score < 80).length,
        assessment.results.filter(r => r.score >= 40 && r.score < 60).length,
        assessment.results.filter(r => r.score < 40).length,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
    }]
  };

  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 md:ml-60 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <button
              onClick={() => navigate('/faculty-dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 md:mb-4 text-sm md:text-base"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
              {assessment.title} - Results & Analysis
            </h1>
            <p className="text-sm md:text-base text-gray-600">{assessment.subject}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
          {/* Test Link Card */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={20} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Share Test Link with Students</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Students can access the test using this link</p>
                <div className="bg-white rounded-lg p-3 border border-gray-200 font-mono text-sm text-gray-700 break-all">
                  {testLink}
                </div>
              </div>
              <button
                onClick={copyTestLink}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Copy size={16} />
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {assessment.status === 'active' && (
              <button
                onClick={handleCloseAssessment}
                className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Close Assessment
              </button>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <Users className="text-blue-600" size={20} />
                <span className="text-xs md:text-sm text-gray-500">Total Students</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{analysis.totalStudents}</p>
            </div>

            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <Award className="text-green-600" size={20} />
                <span className="text-xs md:text-sm text-gray-500">Average Score</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{analysis.averageScore}%</p>
            </div>

            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <AlertTriangle className="text-orange-600" size={20} />
                <span className="text-xs md:text-sm text-gray-500">Weak Concepts</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{analysis.weakConcepts?.length || 0}</p>
            </div>
          </div>

          {/* Weak Concepts - Teaching Improvement Recommendations */}
          {analysis.weakConcepts && analysis.weakConcepts.length > 0 && (
            <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-red-200 mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-red-600 to-orange-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Concepts Needing Revision</h2>
                  <p className="text-sm md:text-base text-gray-600">Students scored below 60% on these topics - recommend revisiting in class</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                {analysis.weakConcepts.map((weakConcept, index) => {
                  const suggestions = improvementSuggestions[weakConcept.topic] || improvementSuggestions["Teaching Methods"];
                  const isCritical = weakConcept.severity === 'critical';
                  
                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-lg md:rounded-xl p-4 md:p-6 border-2 ${
                        isCritical ? 'border-red-400' : 'border-orange-300'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-col md:flex-row items-start justify-between gap-3 md:gap-0 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">{weakConcept.topic}</h3>
                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                              isCritical ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {isCritical ? 'Critical' : 'Needs Attention'}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {weakConcept.studentsAttempted} students attempted • {weakConcept.percentage}% correct rate
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl md:text-3xl font-bold text-red-600">{weakConcept.percentage}%</p>
                          <p className="text-xs md:text-sm text-gray-600">Success Rate</p>
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                        <div
                          className={`h-3 rounded-full ${
                            isCritical ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${weakConcept.percentage}%` }}
                        ></div>
                      </div>

                      {/* Teaching Strategies */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="text-yellow-600" size={18} />
                          <h4 className="text-sm md:text-base font-semibold text-gray-900">Recommended Teaching Strategies</h4>
                        </div>
                        <ul className="space-y-2 ml-6 md:ml-7">
                          {suggestions.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm md:text-base text-gray-700 flex items-start gap-2">
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
                          <h4 className="text-sm md:text-base font-semibold text-gray-900">Teaching Resources</h4>
                        </div>
                        <ul className="space-y-2 ml-6 md:ml-7">
                          {suggestions.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm md:text-base text-gray-700 flex items-start gap-2">
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

          {/* Strong Concepts */}
          {analysis.strongConcepts && analysis.strongConcepts.length > 0 && (
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-green-200 mb-6 md:mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Well-Understood Concepts</h2>
                  <p className="text-sm md:text-base text-gray-600">Students performed well on these topics (≥80%)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {analysis.strongConcepts.map((concept, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm md:text-base font-semibold text-gray-900">{concept.topic}</h4>
                      <span className="text-green-600 font-bold text-base md:text-lg shrink-0">{concept.percentage}%</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {concept.studentsAttempted} students • {concept.correct}/{concept.total} questions correct
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Topic Performance */}
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Topic-wise Performance</h3>
              {analysis.topicAnalysis && analysis.topicAnalysis.length > 0 ? (
                <div className="h-48 md:h-64">
                  <Bar
                    data={topicPerformanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: (value) => value + '%'
                          }
                        }
                      },
                      plugins: {
                        legend: { display: false }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">No data available</p>
              )}
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Score Distribution</h3>
              {assessment.results.length > 0 ? (
                <div className="h-48 md:h-64 flex items-center justify-center">
                  <div className="w-full max-w-xs">
                    <Doughnut data={scoreDistributionData} />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">No submissions yet</p>
              )}
            </div>
          </div>

          {/* Detailed Results Table */}
          {assessment.results.length > 0 && (
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Student Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Student</th>
                      <th className="text-center py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Score</th>
                      <th className="text-center py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Correct/Total</th>
                      <th className="text-center py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Time</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessment.results.map((result, idx) => {
                      const mins = Math.floor(result.timeElapsed / 60);
                      const secs = result.timeElapsed % 60;
                      
                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base text-gray-900 font-medium">{result.studentName}</td>
                          <td className="py-2 md:py-3 px-2 md:px-4 text-center">
                            <span className={`font-bold text-sm md:text-base ${
                              result.score >= 80 ? 'text-green-600' :
                              result.score >= 60 ? 'text-blue-600' :
                              result.score >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {result.score}%
                            </span>
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-4 text-center text-sm md:text-base text-gray-700">
                            {result.correctCount}/{result.totalQuestions}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-4 text-center text-sm md:text-base text-gray-600">
                            {mins}m {secs}s
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-500">
                            {new Date(result.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
