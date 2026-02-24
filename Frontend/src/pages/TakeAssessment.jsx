import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaculty } from '../context/FacultyContext';
import {  ClipboardList, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { assessmentQuestions } from '../utils/assessmentQuestions';

const TakeAssessment = () => {
  const navigate = useNavigate();
  const { facultyList } = useFaculty();
  
  const facultyId = window.localStorage.getItem("facultyId");
  const facultyName = window.localStorage.getItem("facultyName");
  const currentFaculty = facultyList.find(f => f.id === facultyId);
  
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Get questions based on subject
  const subjects = currentFaculty?.subjectsTaught || [];
  const questions = assessmentQuestions[selectedSubject] || assessmentQuestions["Default"];
  
  // Timer effect
  useEffect(() => {
    if (!hasStarted) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft]);
  
  const handleStart = (subject) => {
    setSelectedSubject(subject);
    setHasStarted(true);
  };
  
  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    // Calculate results
    let correct = 0;
    const topicScores = {};
    const weakTopics = [];
    
    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) correct++;
      
      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { correct: 0, total: 0 };
      }
      topicScores[q.topic].total++;
      if (isCorrect) topicScores[q.topic].correct++;
    });
    
    // Find weak topics (< 60% correct)
    Object.entries(topicScores).forEach(([topic, scores]) => {
      const percentage = (scores.correct / scores.total) * 100;
      if (percentage < 60) {
        weakTopics.push({ topic, percentage, ...scores });
      }
    });
    
    const results = {
      score: correct,
      total: questions.length,
      percentage: ((correct / questions.length) * 100).toFixed(1),
      answers,
      questions,
      topicScores,
      weakTopics,
      subject: selectedSubject,
      timeTaken: 600 - timeLeft
    };
    
    // Store results in localStorage
    localStorage.setItem('facultyAssessmentResults', JSON.stringify(results));
    
    // Navigate to results page
    navigate('/faculty/self-assessment/results');
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  
  // Subject Selection Screen
  if (!hasStarted) {
    return (
      <div className="flex">
        <Sidebar role="Faculty" />
        <div className="flex-1 ml-60 min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-8 py-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Pre-Semester Assessment
              </h1>
              <p className="text-gray-600">
                Test your teaching preparedness and get AI-powered improvement suggestions
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">About This Assessment</h2>
                  <div className="space-y-2 text-gray-700">
                    <p>• 10 carefully curated questions to evaluate your subject knowledge and teaching concepts</p>
                    <p>• 10 minutes to complete</p>
                    <p>• Get instant feedback with AI-powered improvement suggestions</p>
                    <p>• Identify weak areas and receive personalized learning resources</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Select Subject for Assessment</h3>
              
              {subjects.length > 0 ? (
                <div className="grid gap-4">
                  {subjects.map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => handleStart(subject)}
                      className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                            {subject}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {assessmentQuestions[subject] ? '10 subject-specific questions' : '10 general teaching questions'}
                          </p>
                        </div>
                        <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handleStart('Default')}
                    className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                          General Teaching Assessment
                        </h4>
                        <p className="text-sm text-gray-600">
                          Universal teaching methodology and pedagogy questions
                        </p>
                      </div>
                      <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStart('Default')}
                  className="w-full text-left p-6 border-2 border-blue-500 bg-blue-50 rounded-xl"
                >
                  <h4 className="text-lg font-semibold text-blue-600 mb-1">
                    General Teaching Assessment
                  </h4>
                  <p className="text-sm text-gray-600">
                    Start with universal teaching methodology questions
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Assessment Test Screen
  const question = questions[currentQuestion];
  
  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 ml-60 min-h-screen bg-gray-50">
        {/* Header with Timer */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedSubject || 'General Teaching'} Assessment</h1>
                <p className="text-sm text-gray-600 mt-1">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeLeft < 120 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock size={20} />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {answeredCount} of {questions.length} questions answered
              </p>
            </div>
          </div>
        </div>
        
        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{currentQuestion + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {question.topic}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {question.question}
                </h2>
              </div>
            </div>
            
            {/* Options */}
            <div className="space-y-3 mt-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, index)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    answers[question.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[question.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      answers[question.id] === index ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex gap-3">
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
          
          {/* Question Navigation */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Question Overview</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                    currentQuestion === index
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : answers[q.id] !== undefined
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAssessment;
