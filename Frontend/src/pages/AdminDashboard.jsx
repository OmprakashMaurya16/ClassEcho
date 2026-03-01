import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useFaculty } from "../context/FacultyContext";
import {
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  Activity,
  AlertCircle,
  Building2,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { facultyList, departments } = useFaculty();

  const metrics = useMemo(() => {
    const totalDepartments = departments.filter((d) => d !== "FE").length;
    const totalFaculty = facultyList.length;

    const sessionsConducted = 850;
    const responsesCollected = 6800;
    const participationRate = 85;
    const sentimentScore = 4.2;

    return {
      totalDepartments,
      totalFaculty,
      sessionsConducted,
      responsesCollected,
      participationRate,
      sentimentScore,
    };
  }, [facultyList, departments]);

  const departmentPerformance = useMemo(() => {
    const deptNames = {
      INFT: "Computer Science",
      CMPN: "Computer Engineering",
      EXTC: "Electrical Eng.",
      EXCS: "Mechanical Eng.",
      BIOMED: "Civil Engineering",
    };

    return departments
      .filter((d) => d !== "FE")
      .map((dept) => {
        const deptFaculty = facultyList.filter((f) => f.department === dept);
        const performance = (4.0 + Math.random() * 1.0).toFixed(1);
        const sentiment = (3.5 + Math.random() * 1.5).toFixed(1);
        const participation = 75 + Math.floor(Math.random() * 20);

        return {
          department: deptNames[dept] || dept,
          code: dept,
          performance: parseFloat(performance),
          sentiment: parseFloat(sentiment),
          participation,
          facultyCount: deptFaculty.length,
          isHighest: false,
          isLowest: false,
        };
      })
      .sort((a, b) => b.performance - a.performance);
  }, [facultyList, departments]);

  if (departmentPerformance.length > 0) {
    departmentPerformance[0].isHighest = true;
    departmentPerformance[departmentPerformance.length - 1].isLowest = true;
  }

  const facultySnapshot = useMemo(() => {
    const total = facultyList.length;
    const highPerforming = Math.floor(total * 0.73);
    const averagePerforming = Math.floor(total * 0.21);
    const needsImprovement = total - highPerforming - averagePerforming;

    return {
      highPerforming,
      averagePerforming,
      needsImprovement,
      total,
    };
  }, [facultyList]);

  const feedbackTrend = [
    { week: "Week 1", submissions: 75 },
    { week: "Week 2", submissions: 95 },
    { week: "Week 3", submissions: 140 },
    { week: "Week 4", submissions: 135 },
    { week: "Week 5", submissions: 145 },
    { week: "Week 6", submissions: 130 },
    { week: "Week 7", submissions: 80 },
    { week: "Week 8", submissions: 165 },
  ];

  const sentimentData = {
    positive: 75,
    neutral: 15,
    negative: 10,
  };

  const getDepartmentName = (code) => {
    const names = {
      INFT: "Information Technology",
      CMPN: "Computer Engineering",
      EXTC: "Electronics & Telecommunication",
      EXCS: "Mechanical Engineering",
      BIOMED: "Biomedical Engineering",
    };
    return names[code] || code;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="Admin" />
      <main className="flex-1 ml-60">
        <div className="px-10 py-8 bg-white border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, Admin - Institute Performance Overview
          </h1>
          <p className="text-sm text-gray-500">
            Last login:{" "}
            {new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            | Academic Period: Fall 2023
          </p>
        </div>

        <div className="px-10 py-8">
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-600 mb-1">
                Total
                <br />
                Departments
              </p>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {metrics.totalDepartments}
              </h2>
              <p className="text-xs text-green-600 font-medium">
                +2 from last period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-600 mb-1">Total Faculty</p>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {metrics.totalFaculty}
              </h2>
              <p className="text-xs text-green-600 font-medium">
                +5 from last period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-600 mb-1">
                Sessions
                <br />
                Conducted
              </p>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {metrics.sessionsConducted}
              </h2>
              <p className="text-xs text-green-600 font-medium">
                +50 from last period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-600 mb-1">
                Responses
                <br />
                Collected
              </p>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {metrics.responsesCollected}
              </h2>
              <p className="text-xs text-green-600 font-medium">
                +400 from last period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-600 mb-1">
                Participation
                <br />
                Rate
              </p>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {metrics.participationRate}%
              </h2>
              <p className="text-xs text-green-600 font-medium">
                +5% from last period
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-600 mb-1">
                Sentiment
                <br />
                Score
              </p>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {metrics.sentimentScore}/5
              </h2>
              <p className="text-xs text-red-600 font-medium">
                -0.1 from last period
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Department-wise Performance Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Comparison of key metrics across all departments
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Department
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Performance
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Sentiment
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Participation
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentPerformance.map((dept, idx) => (
                      <tr
                        key={dept.code}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-800 text-sm">
                            {dept.department}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-semibold text-sm ${
                              dept.isHighest
                                ? "text-green-600"
                                : dept.isLowest
                                  ? "text-red-600"
                                  : "text-gray-800"
                            }`}
                          >
                            {dept.performance}/5
                            {dept.isHighest && (
                              <span className="text-xs ml-1">(Highest)</span>
                            )}
                            {dept.isLowest && (
                              <span className="text-xs ml-1">(Lowest)</span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm text-gray-700">
                            {dept.sentiment}/5
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm text-gray-700">
                            {dept.participation}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() =>
                              navigate(`/admin/department/${dept.code}`)
                            }
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mx-auto"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Faculty Performance Snapshot
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">
                      High Performing
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {facultySnapshot.highPerforming}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(facultySnapshot.highPerforming / facultySnapshot.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">
                      Average Performing
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {facultySnapshot.averagePerforming}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${(facultySnapshot.averagePerforming / facultySnapshot.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">
                      Needs Improvement
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {facultySnapshot.needsImprovement}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(facultySnapshot.needsImprovement / facultySnapshot.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Feedback Submissions Over Time
                </h3>
                <p className="text-sm text-gray-500">
                  Weekly submission trends for the current academic period.
                </p>
              </div>

              <div className="relative w-full h-64">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 700 240"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text x="10" y="20" className="fill-gray-400" fontSize="11">
                    190
                  </text>
                  <text x="10" y="70" className="fill-gray-400" fontSize="11">
                    140
                  </text>
                  <text x="10" y="120" className="fill-gray-400" fontSize="11">
                    90
                  </text>
                  <text x="10" y="170" className="fill-gray-400" fontSize="11">
                    40
                  </text>

                  {[20, 70, 120, 170].map((y, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}

                  <path
                    d={feedbackTrend
                      .map((point, i) => {
                        const x = 50 + i * 90;
                        const y = 200 - (point.submissions / 200) * 180;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {feedbackTrend.map((point, i) => {
                    const x = 50 + i * 90;
                    const y = 200 - (point.submissions / 200) * 180;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="white"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                      />
                    );
                  })}

                  {feedbackTrend.map((point, i) => {
                    const x = 50 + i * 90;
                    return (
                      <text
                        key={`label-${i}`}
                        x={x}
                        y="225"
                        textAnchor="middle"
                        className="fill-gray-500"
                        fontSize="10"
                      >
                        {point.week.replace("Week ", "W")}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Sentiment Analysis Summary
                </h3>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="12"
                        strokeDasharray={`${(sentimentData.positive / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="12"
                        strokeDasharray={`${(sentimentData.neutral / 100) * 251.2} 251.2`}
                        strokeDashoffset={
                          -((sentimentData.positive / 100) * 251.2)
                        }
                        strokeLinecap="round"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="12"
                        strokeDasharray={`${(sentimentData.negative / 100) * 251.2} 251.2`}
                        strokeDashoffset={
                          -(
                            ((sentimentData.positive + sentimentData.neutral) /
                              100) *
                            251.2
                          )
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-600">Positive</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {sentimentData.positive}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm text-gray-600">Neutral</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {sentimentData.neutral}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm text-gray-600">Negative</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {sentimentData.negative}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Alerts & Insights
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingDown
                        size={16}
                        className="text-red-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-red-800 mb-1">
                          Declining Trend
                        </p>
                        <p className="text-xs text-red-700">
                          Civil Engineering department score dropped by 12% this
                          month.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className="text-yellow-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-yellow-800 mb-1">
                          Low Participation
                        </p>
                        <p className="text-xs text-yellow-700">
                          Dr. Alan Turing (CS-101) has a participation rate of
                          only 65%.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard;
