import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Avatar from '../components/Avatar';
import { useFaculty } from '../context/FacultyContext';
import { 
  ChevronRight, 
  Star, 
  Users, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Clock,
  Target,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BarChart3
} from 'lucide-react';

const FacultyReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { facultyList } = useFaculty();
  const [activeTab, setActiveTab] = useState('overall');

  // Find faculty by ID
  const faculty = useMemo(() => {
    return facultyList.find(f => f.id === id);
  }, [id, facultyList]);

  // Mock data for demonstration - overall and per subject
  const getDataForTab = (tab) => {
    const overallData = {
      aggregateScore: 4.5,
      attendance: 92,
      syllabusCoverage: 87,
      totalStudents: 180,
      weeklyPerformance: [
        { week: 'Week 1', facultyScore: 4.2, deptAvg: 4.0 },
        { week: 'Week 3', facultyScore: 4.3, deptAvg: 4.05 },
        { week: 'Week 5', facultyScore: 4.4, deptAvg: 4.1 },
        { week: 'Week 7', facultyScore: 4.3, deptAvg: 4.08 },
        { week: 'Week 9', facultyScore: 4.2, deptAvg: 4.0 },
        { week: 'Week 12', facultyScore: 4.8, deptAvg: 4.15 },
      ],
      parameters: [
        { name: 'Teaching Quality', score: 4.7, color: 'bg-blue-500' },
        { name: 'Communication', score: 4.5, color: 'bg-green-500' },
        { name: 'Subject Knowledge', score: 4.8, color: 'bg-purple-500' },
        { name: 'Availability', score: 4.2, color: 'bg-yellow-500' },
        { name: 'Assignments', score: 4.4, color: 'bg-red-500' },
      ],
      engagement: {
        active: 145,
        moderate: 25,
        low: 10,
      },
      recentFeedback: [
        { 
          id: 1, 
          student: 'Anonymous Student', 
          comment: 'Excellent teaching methodology and very helpful during doubts clarification.',
          rating: 5,
          date: '2024-01-15',
          sentiment: 'positive'
        },
        { 
          id: 2, 
          student: 'Anonymous Student', 
          comment: 'Great subject knowledge but sometimes explanations are too fast.',
          rating: 4,
          date: '2024-01-14',
          sentiment: 'neutral'
        },
        { 
          id: 3, 
          student: 'Anonymous Student', 
          comment: 'Very approachable and always ready to help. Assignments are relevant and helpful.',
          rating: 5,
          date: '2024-01-13',
          sentiment: 'positive'
        },
        { 
          id: 4, 
          student: 'Anonymous Student', 
          comment: 'Need more practical examples in lectures.',
          rating: 3,
          date: '2024-01-12',
          sentiment: 'negative'
        },
      ],
    };

    // Subject-specific data variations
    const subjectData = {
      aggregateScore: 4.3 + Math.random() * 0.4,
      attendance: 88 + Math.floor(Math.random() * 8),
      syllabusCoverage: 82 + Math.floor(Math.random() * 10),
      totalStudents: 60 + Math.floor(Math.random() * 30),
      weeklyPerformance: [
        { week: 'Week 1', facultyScore: 4.0 + Math.random() * 0.3, deptAvg: 3.9 + Math.random() * 0.2 },
        { week: 'Week 3', facultyScore: 4.1 + Math.random() * 0.3, deptAvg: 4.0 + Math.random() * 0.2 },
        { week: 'Week 5', facultyScore: 4.2 + Math.random() * 0.3, deptAvg: 4.0 + Math.random() * 0.2 },
        { week: 'Week 7', facultyScore: 4.0 + Math.random() * 0.4, deptAvg: 4.0 + Math.random() * 0.2 },
        { week: 'Week 9', facultyScore: 3.9 + Math.random() * 0.4, deptAvg: 3.9 + Math.random() * 0.2 },
        { week: 'Week 12', facultyScore: 4.5 + Math.random() * 0.4, deptAvg: 4.1 + Math.random() * 0.2 },
      ],
      parameters: [
        { name: 'Teaching Quality', score: 4.5 + Math.random() * 0.4, color: 'bg-blue-500' },
        { name: 'Communication', score: 4.3 + Math.random() * 0.4, color: 'bg-green-500' },
        { name: 'Subject Knowledge', score: 4.6 + Math.random() * 0.4, color: 'bg-purple-500' },
        { name: 'Availability', score: 4.0 + Math.random() * 0.4, color: 'bg-yellow-500' },
        { name: 'Assignments', score: 4.2 + Math.random() * 0.4, color: 'bg-red-500' },
      ],
      engagement: {
        active: 50 + Math.floor(Math.random() * 30),
        moderate: 10 + Math.floor(Math.random() * 15),
        low: 5 + Math.floor(Math.random() * 10),
      },
      recentFeedback: [
        { 
          id: 1, 
          student: 'Anonymous Student', 
          comment: `Great ${tab} lectures with practical examples.`,
          rating: 5,
          date: '2024-01-15',
          sentiment: 'positive'
        },
        { 
          id: 2, 
          student: 'Anonymous Student', 
          comment: `${tab} concepts explained clearly but need more time for practice.`,
          rating: 4,
          date: '2024-01-14',
          sentiment: 'neutral'
        },
      ],
    };

    return tab === 'overall' ? overallData : subjectData;
  };

  const mockData = useMemo(() => getDataForTab(activeTab), [activeTab]);

  if (!faculty) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="HOD" />
        <main className="flex-1 ml-60 flex items-center justify-center">
          <p className="text-gray-500">Faculty not found</p>
        </main>
      </div>
    );
  }

  const subjects = Array.isArray(faculty.subjectsTaught) 
    ? faculty.subjectsTaught 
    : [faculty.subjectsTaught];

  const tabs = ['overall', ...subjects.map(s => s.toLowerCase())];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="HOD" />
      <main className="flex-1 ml-60">
        {/* Header with Breadcrumbs */}
        <div className="px-10 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button 
              onClick={() => navigate('/hod-dashboard')}
              className="hover:text-blue-600"
            >
              Dashboard
            </button>
            <ChevronRight size={16} />
            <button 
              onClick={() => navigate('/hod-dashboard/faculty')}
              className="hover:text-blue-600"
            >
              Faculty
            </button>
            <ChevronRight size={16} />
            <span className="text-gray-800 font-medium">{faculty.name}</span>
          </div>

          {/* Faculty Profile */}
          <div className="flex items-center gap-4">
            <Avatar name={faculty.name} color={faculty.avatarColor} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{faculty.name}</h1>
              <p className="text-gray-600">{faculty.designation} • {faculty.department}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <BookOpen size={14} />
                  {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Users size={14} />
                  {mockData.totalStudents} Students
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-10 py-4 bg-white border-b border-gray-200">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-10 py-8">
          {/* Tab Context Indicator */}
          {activeTab !== 'overall' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Viewing: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span> - 
                Subject-specific analytics and performance metrics
              </p>
            </div>
          )}
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Aggregate Score</p>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Star size={18} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">{mockData.aggregateScore.toFixed(1)}</h2>
                <span className="text-xs text-gray-500 mb-1">/ 5.0</span>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                +0.3 from last month
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Calendar size={18} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">{mockData.attendance}</h2>
                <span className="text-xs text-gray-500 mb-1">%</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${mockData.attendance}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Syllabus Coverage</p>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target size={18} className="text-purple-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">{mockData.syllabusCoverage}</h2>
                <span className="text-xs text-gray-500 mb-1">%</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${mockData.syllabusCoverage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Weekly Performance Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">Weekly Performance Trend</h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">{faculty.name.split(' ')[1] || faculty.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-600">Dept Avg</span>
                  </div>
                </div>
              </div>
              
              {/* SVG Line Chart */}
              <div className="relative w-full h-64">
                <svg className="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                  {/* Y-axis labels */}
                  <text x="10" y="20" className="text-xs fill-gray-400" fontSize="12">5.0</text>
                  <text x="10" y="80" className="text-xs fill-gray-400" fontSize="12">4.0</text>
                  <text x="10" y="140" className="text-xs fill-gray-400" fontSize="12">3.0</text>
                  <text x="10" y="200" className="text-xs fill-gray-400" fontSize="12">2.0</text>
                  
                  {/* Grid lines */}
                  {[20, 80, 140, 200].map((y, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1={y}
                      x2="580"
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Department Average Line (Gray) */}
                  <path
                    d={mockData.weeklyPerformance.map((point, i) => {
                      const x = 50 + (i * 106);
                      const y = 210 - ((point.deptAvg / 5) * 180);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Faculty Score Line (Blue) */}
                  <path
                    d={mockData.weeklyPerformance.map((point, i) => {
                      const x = 50 + (i * 106);
                      const y = 210 - ((point.facultyScore / 5) * 180);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points - Department Avg */}
                  {mockData.weeklyPerformance.map((point, i) => {
                    const x = 50 + (i * 106);
                    const y = 210 - ((point.deptAvg / 5) * 180);
                    return (
                      <circle
                        key={`dept-${i}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="white"
                        stroke="#d1d5db"
                        strokeWidth="3"
                      />
                    );
                  })}
                  
                  {/* Data points - Faculty Score */}
                  {mockData.weeklyPerformance.map((point, i) => {
                    const x = 50 + (i * 106);
                    const y = 210 - ((point.facultyScore / 5) * 180);
                    return (
                      <circle
                        key={`faculty-${i}`}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="white"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                    );
                  })}
                  
                  {/* X-axis labels */}
                  {mockData.weeklyPerformance.map((point, i) => {
                    const x = 50 + (i * 106);
                    return (
                      <text
                        key={`label-${i}`}
                        x={x}
                        y="235"
                        textAnchor="middle"
                        className="fill-gray-500"
                        fontSize="12"
                      >
                        {point.week}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Parameter Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-6">Parameter Analysis</h3>
              <div className="space-y-4">
                {mockData.parameters.map((param, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{param.name}</span>
                      <span className="font-medium text-gray-800">{param.score.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${param.color} rounded-full`}
                        style={{ width: `${(param.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Student Engagement */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-6">Student Engagement</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray={`${(mockData.engagement.active / mockData.totalStudents) * 251.2} 251.2`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="10"
                      strokeDasharray={`${(mockData.engagement.moderate / mockData.totalStudents) * 251.2} 251.2`}
                      strokeDashoffset={-((mockData.engagement.active / mockData.totalStudents) * 251.2)}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-2xl font-bold fill-gray-800"
                    >
                      {mockData.totalStudents}
                    </text>
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{mockData.engagement.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <span className="text-sm text-gray-600">Moderate</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{mockData.engagement.moderate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-600">Low</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{mockData.engagement.low}</span>
                </div>
              </div>
            </div>

            {/* Recent Feedback Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-6">Feedback Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <ThumbsUp size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Positive</p>
                      <p className="text-xs text-gray-500">Students appreciate teaching</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {mockData.recentFeedback.filter(f => f.sentiment === 'positive').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <MessageSquare size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Neutral</p>
                      <p className="text-xs text-gray-500">Room for improvement</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">
                    {mockData.recentFeedback.filter(f => f.sentiment === 'neutral').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <ThumbsDown size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Negative</p>
                      <p className="text-xs text-gray-500">Needs attention</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {mockData.recentFeedback.filter(f => f.sentiment === 'negative').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Feedback Comments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Recent Student Feedback</h3>
            <div className="space-y-4">
              {mockData.recentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{feedback.student}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(feedback.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feedback.sentiment === 'positive' 
                        ? 'bg-green-100 text-green-700'
                        : feedback.sentiment === 'negative'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-10">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default FacultyReport;
