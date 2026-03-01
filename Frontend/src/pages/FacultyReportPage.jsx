import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFaculty } from "../context/FacultyContext";
import { useSession } from "../context/SessionContext";
import Sidebar from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Award,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Calendar,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const FacultyReportPage = () => {
  const navigate = useNavigate();
  const { facultyList } = useFaculty();
  const { getFacultyAnalytics, getFacultySessions } = useSession();

  const facultyId = window.localStorage.getItem("facultyId");
  const facultyName = window.localStorage.getItem("facultyName");
  const facultyDepartment = window.localStorage.getItem("facultyDepartment");

  const currentFaculty = useMemo(() => {
    return facultyList.find((f) => f.id === facultyId);
  }, [facultyList, facultyId]);

  const analyticsData = useMemo(() => {
    return getFacultyAnalytics(facultyId);
  }, [getFacultyAnalytics, facultyId]);

  const [activeTab, setActiveTab] = useState("Overall");

  const getDataForTab = (tab) => {
    const hasRealData = analyticsData.totalResponses > 0;

    if (hasRealData) {
      return {
        performanceScores: [
          4.2,
          4.3,
          4.5,
          4.4,
          4.6,
          4.7,
          4.5,
          analyticsData.averageRating,
        ],
        deptAvg: [4.0, 4.1, 4.2, 4.1, 4.3, 4.2, 4.3, 4.4],
        overallRating: analyticsData.averageRating,
        totalResponses: analyticsData.totalResponses,
        responseRate: 87,
        positiveSentiment: analyticsData.sentimentDistribution.positive,
        parameterScores: [
          analyticsData.parameterAverages.teaching || 0,
          analyticsData.parameterAverages.clarity || 0,
          analyticsData.parameterAverages.engagement || 0,
          analyticsData.parameterAverages.knowledge || 0,
          analyticsData.parameterAverages.availability || 0,
          analyticsData.parameterAverages.helpfulness || 0,
        ],
        sentimentDistribution: [
          analyticsData.sentimentDistribution.positive,
          analyticsData.sentimentDistribution.neutral,
          analyticsData.sentimentDistribution.negative,
        ],
      };
    }

    const subjectSpecificData = {
      Overall: {
        performanceScores: [4.2, 4.3, 4.5, 4.4, 4.6, 4.7, 4.5, 4.8],
        deptAvg: [4.0, 4.1, 4.2, 4.1, 4.3, 4.2, 4.3, 4.4],
        overallRating: 4.6,
        totalResponses: 0,
        responseRate: 0,
        positiveSentiment: 75,
        parameterScores: [4.7, 4.5, 4.8, 4.6, 4.3, 4.9],
        sentimentDistribution: [75, 20, 5],
      },
      [currentFaculty?.subjectsTaught?.[0]]: {
        performanceScores: [4.3, 4.4, 4.6, 4.5, 4.7, 4.8, 4.6, 4.9],
        deptAvg: [4.0, 4.1, 4.2, 4.1, 4.3, 4.2, 4.3, 4.4],
        overallRating: 4.6,
        totalResponses: 0,
        responseRate: 0,
        positiveSentiment: 78,
        parameterScores: [4.8, 4.6, 4.9, 4.7, 4.4, 4.9],
        sentimentDistribution: [78, 18, 4],
      },
      [currentFaculty?.subjectsTaught?.[1]]: {
        performanceScores: [4.1, 4.2, 4.4, 4.3, 4.5, 4.6, 4.4, 4.7],
        deptAvg: [4.0, 4.1, 4.2, 4.1, 4.3, 4.2, 4.3, 4.4],
        overallRating: 4.4,
        totalResponses: 0,
        responseRate: 0,
        positiveSentiment: 72,
        parameterScores: [4.6, 4.4, 4.7, 4.5, 4.2, 4.8],
        sentimentDistribution: [72, 22, 6],
      },
    };

    return subjectSpecificData[tab] || subjectSpecificData["Overall"];
  };

  const currentData = getDataForTab(activeTab);

  const performanceData = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
    ],
    datasets: [
      {
        label: "Your Score",
        data: currentData.performanceScores,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Department Average",
        data: currentData.deptAvg,
        borderColor: "rgb(156, 163, 175)",
        backgroundColor: "rgba(156, 163, 175, 0.1)",
        tension: 0.4,
        fill: true,
        borderDash: [5, 5],
      },
    ],
  };

  const subjectPerformanceData = {
    labels: currentFaculty?.subjectsTaught || ["Subject 1", "Subject 2"],
    datasets: [
      {
        label: "Average Rating",
        data: [4.6, 4.4],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgb(59, 130, 246)", "rgb(16, 185, 129)"],
        borderWidth: 2,
      },
    ],
  };

  const parameterData = {
    labels: [
      "Content Quality",
      "Clarity",
      "Engagement",
      "Response Time",
      "Innovation",
      "Preparedness",
    ],
    datasets: [
      {
        label: "Your Performance",
        data: currentData.parameterScores,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
      },
      {
        label: "Department Average",
        data: [4.2, 4.1, 4.3, 4.0, 4.2, 4.4],
        backgroundColor: "rgba(156, 163, 175, 0.2)",
        borderColor: "rgb(156, 163, 175)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(156, 163, 175)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(156, 163, 175)",
      },
    ],
  };

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: currentData.sentimentDistribution,
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const allFeedback = [
    {
      id: 1,
      date: "Feb 20, 2026",
      course: currentFaculty?.subjectsTaught?.[0] || "Machine Learning",
      rating: 5,
      comment:
        "Excellent explanation of complex concepts. Very engaging lectures.",
      sentiment: "positive",
    },
    {
      id: 2,
      date: "Feb 18, 2026",
      course: currentFaculty?.subjectsTaught?.[1] || "Data Science",
      rating: 4,
      comment: "Good teaching style, but could use more practical examples.",
      sentiment: "positive",
    },
    {
      id: 3,
      date: "Feb 15, 2026",
      course: currentFaculty?.subjectsTaught?.[0] || "Machine Learning",
      rating: 5,
      comment: "Always well-prepared and answers questions thoroughly.",
      sentiment: "positive",
    },
    {
      id: 4,
      date: "Feb 14, 2026",
      course: currentFaculty?.subjectsTaught?.[1] || "Data Science",
      rating: 4,
      comment: "Clear explanations and good pace of teaching.",
      sentiment: "positive",
    },
    {
      id: 5,
      date: "Feb 12, 2026",
      course: currentFaculty?.subjectsTaught?.[0] || "Machine Learning",
      rating: 5,
      comment: "Very interactive sessions. Learned a lot!",
      sentiment: "positive",
    },
  ];

  const recentFeedback =
    activeTab === "Overall"
      ? allFeedback
      : allFeedback.filter((f) => f.course === activeTab);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 ml-60 bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <button
              onClick={() => navigate("/faculty-dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Performance Report
                </h1>
                <p className="text-gray-600">
                  {currentFaculty?.name || facultyName} • {facultyDepartment}{" "}
                  Department
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Current Semester</p>
                <p className="text-xl font-bold text-gray-900">Spring 2026</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 mb-6 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("Overall")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "Overall"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Overall
            </button>
            {currentFaculty?.subjectsTaught?.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === subject
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">
                  Overall Rating
                </span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="text-blue-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {currentData.overallRating}
              </p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp size={16} />
                <span className="font-medium">+0.3 from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">
                  Total Responses
                </span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {currentData.totalResponses}
              </p>
              <p className="text-sm text-gray-500">From 8 sessions</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">
                  Response Rate
                </span>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {currentData.responseRate}%
              </p>
              <p className="text-sm text-gray-500">Above department avg</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">
                  Positive Sentiment
                </span>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="text-orange-600" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {currentData.positiveSentiment}%
              </p>
              <p className="text-sm text-gray-500">Excellent feedback</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Performance Trend
              </h3>
              <div className="h-80">
                <Line data={performanceData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Parameter Analysis
              </h3>
              <div className="h-80">
                <Radar data={parameterData} options={radarOptions} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Subject-wise Performance
              </h3>
              <div className="h-80">
                <Bar data={subjectPerformanceData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Feedback Sentiment
              </h3>
              <div className="h-80 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <Doughnut data={sentimentData} options={doughnutOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare size={24} className="text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">
                Recent Feedback
              </h3>
            </div>

            {analyticsData.recentFeedback &&
            analyticsData.recentFeedback.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(feedback.submittedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.overallRating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        {feedback.overallRating >= 4 ? (
                          <ThumbsUp size={18} className="text-green-500" />
                        ) : feedback.overallRating === 3 ? (
                          <MessageSquare
                            size={18}
                            className="text-yellow-500"
                          />
                        ) : (
                          <ThumbsDown size={18} className="text-red-500" />
                        )}
                      </div>
                    </div>

                    {feedback.strengths && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-green-700 mb-1">
                          👍 What worked well:
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {feedback.strengths}
                        </p>
                      </div>
                    )}

                    {feedback.improvements && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-blue-700 mb-1">
                          💡 Suggestions:
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {feedback.improvements}
                        </p>
                      </div>
                    )}

                    {feedback.comments && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          💬 Additional comments:
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {feedback.comments}
                        </p>
                      </div>
                    )}

                    {!feedback.strengths &&
                      !feedback.improvements &&
                      !feedback.comments && (
                        <p className="text-gray-500 italic">
                          No written feedback provided
                        </p>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare
                  size={48}
                  className="text-gray-300 mx-auto mb-4"
                />
                <p className="text-gray-500 font-medium">
                  No feedback received yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Generate a QR code to start collecting student feedback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyReportPage;
