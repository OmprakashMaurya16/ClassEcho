import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Avatar from "../components/Avatar";
import { useFaculty } from "../context/FacultyContext";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  BookOpen,
  Award,
  AlertCircle,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

const HodReport = () => {
  const hodDepartment = window.localStorage.getItem("hodDepartment") || "INFT";
  const { getFacultyByDepartment } = useFaculty();
  const [selectedPeriod, setSelectedPeriod] = useState("current-semester");

  const departmentFaculty = useMemo(() => {
    return getFacultyByDepartment(hodDepartment);
  }, [hodDepartment, getFacultyByDepartment]);

  const performanceData = useMemo(() => {
    return departmentFaculty.map((faculty) => ({
      ...faculty,
      overallScore: (4.0 + Math.random() * 1.0).toFixed(2),
      attendanceRate: 85 + Math.floor(Math.random() * 12),
      syllabusCompletion: 80 + Math.floor(Math.random() * 15),
      studentEngagement: 75 + Math.floor(Math.random() * 20),
      assignmentQuality: (4.0 + Math.random() * 0.8).toFixed(1),
      responsiveness: (4.2 + Math.random() * 0.7).toFixed(1),
      totalStudents: 60 + Math.floor(Math.random() * 40),
      feedbackCount: 45 + Math.floor(Math.random() * 30),
    }));
  }, [departmentFaculty]);

  const departmentMetrics = useMemo(() => {
    if (performanceData.length === 0)
      return {
        avgScore: 0,
        avgAttendance: 0,
        avgSyllabus: 0,
        totalStudents: 0,
        totalFeedback: 0,
        avgEngagement: 0,
      };

    const total = performanceData.reduce(
      (acc, faculty) => ({
        score: acc.score + parseFloat(faculty.overallScore),
        attendance: acc.attendance + faculty.attendanceRate,
        syllabus: acc.syllabus + faculty.syllabusCompletion,
        students: acc.students + faculty.totalStudents,
        feedback: acc.feedback + faculty.feedbackCount,
        engagement: acc.engagement + faculty.studentEngagement,
      }),
      {
        score: 0,
        attendance: 0,
        syllabus: 0,
        students: 0,
        feedback: 0,
        engagement: 0,
      },
    );

    return {
      avgScore: (total.score / performanceData.length).toFixed(2),
      avgAttendance: Math.round(total.attendance / performanceData.length),
      avgSyllabus: Math.round(total.syllabus / performanceData.length),
      totalStudents: total.students,
      totalFeedback: total.feedback,
      avgEngagement: Math.round(total.engagement / performanceData.length),
    };
  }, [performanceData]);

  const monthlyTrend = [
    { month: "Aug", score: 4.1, attendance: 88, engagement: 82 },
    { month: "Sep", score: 4.2, attendance: 89, engagement: 84 },
    { month: "Oct", score: 4.3, attendance: 90, engagement: 85 },
    { month: "Nov", score: 4.4, attendance: 91, engagement: 87 },
    { month: "Dec", score: 4.5, attendance: 92, engagement: 88 },
    { month: "Jan", score: 4.6, attendance: 91, engagement: 90 },
  ];

  const subjectPerformance = [
    {
      subject: "Machine Learning",
      avgScore: 4.7,
      students: 120,
      color: "bg-blue-500",
    },
    {
      subject: "Data Science",
      avgScore: 4.5,
      students: 110,
      color: "bg-green-500",
    },
    {
      subject: "Database Systems",
      avgScore: 4.4,
      students: 130,
      color: "bg-purple-500",
    },
    {
      subject: "Cloud Computing",
      avgScore: 4.3,
      students: 100,
      color: "bg-yellow-500",
    },
    {
      subject: "Web Development",
      avgScore: 4.2,
      students: 115,
      color: "bg-red-500",
    },
  ];

  const topPerformers = [...performanceData]
    .sort((a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore))
    .slice(0, 3);

  const needsImprovement = [...performanceData]
    .sort((a, b) => parseFloat(a.overallScore) - parseFloat(b.overallScore))
    .slice(0, 3);

  const getDepartmentName = (dept) => {
    const names = {
      INFT: "Information Technology",
      CMPN: "Computer Engineering",
      EXTC: "Electronics & Telecommunication",
      EXCS: "Mechanical Engineering",
      BIOMED: "Biomedical Engineering",
    };
    return names[dept] || dept;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="HOD" />
      <main className="flex-1 ml-60">
        <div className="px-10 py-8 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Department Performance Report
              </h1>
              <p className="text-gray-500 mt-1">
                {getDepartmentName(hodDepartment)} • Academic Year 2023-2024
              </p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current-semester">Current Semester</option>
              <option value="previous-semester">Previous Semester</option>
              <option value="academic-year">Full Academic Year</option>
            </select>
          </div>
        </div>

        <div className="px-10 py-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Avg Faculty Score</p>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Star size={18} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {departmentMetrics.avgScore}
                </h2>
                <span className="text-xs text-gray-500 mb-1">/ 5.0</span>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                +0.3 from last month
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Calendar size={18} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {departmentMetrics.avgAttendance}
                </h2>
                <span className="text-xs text-gray-500 mb-1">%</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${departmentMetrics.avgAttendance}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Total Students</p>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users size={18} className="text-purple-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {departmentMetrics.totalStudents}
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Across {departmentFaculty.length} faculty members
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Activity size={18} className="text-yellow-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {departmentMetrics.avgEngagement}
                </h2>
                <span className="text-xs text-gray-500 mb-1">%</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${departmentMetrics.avgEngagement}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">
                  6-Month Performance Trend
                </h3>
                <BarChart3 size={18} className="text-gray-400" />
              </div>

              <div className="relative w-full h-64">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 500 240"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text x="5" y="20" className="fill-gray-400" fontSize="12">
                    5.0
                  </text>
                  <text x="5" y="80" className="fill-gray-400" fontSize="12">
                    4.0
                  </text>
                  <text x="5" y="140" className="fill-gray-400" fontSize="12">
                    3.0
                  </text>
                  <text x="5" y="200" className="fill-gray-400" fontSize="12">
                    2.0
                  </text>

                  {[20, 80, 140, 200].map((y, i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={y}
                      x2="480"
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}

                  <path
                    d={monthlyTrend
                      .map((point, i) => {
                        const x = 40 + i * 73;
                        const y = 210 - (point.score / 5) * 180;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {monthlyTrend.map((point, i) => {
                    const x = 40 + i * 73;
                    const y = 210 - (point.score / 5) * 180;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="white"
                          stroke="#3b82f6"
                          strokeWidth="3"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className="fill-gray-600"
                          fontSize="11"
                          fontWeight="600"
                        >
                          {point.score}
                        </text>
                      </g>
                    );
                  })}

                  {monthlyTrend.map((point, i) => {
                    const x = 40 + i * 73;
                    return (
                      <text
                        key={`label-${i}`}
                        x={x}
                        y="230"
                        textAnchor="middle"
                        className="fill-gray-500"
                        fontSize="12"
                      >
                        {point.month}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">
                  Subject-wise Performance
                </h3>
                <Target size={18} className="text-gray-400" />
              </div>
              <div className="space-y-4">
                {subjectPerformance.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <div>
                        <span className="text-gray-700 font-medium">
                          {subject.subject}
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          ({subject.students} students)
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {subject.avgScore}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${subject.color} rounded-full`}
                        style={{ width: `${(subject.avgScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Faculty Performance Overview
              </h3>
              <span className="text-sm text-gray-500">
                {performanceData.length} Faculty Members
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Faculty
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Overall Score
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Attendance
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Syllabus %
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Engagement
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Students
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((faculty, idx) => (
                    <tr
                      key={faculty.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={faculty.name}
                            color={faculty.avatarColor}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {faculty.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {faculty.designation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star
                            size={14}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="font-semibold text-gray-800">
                            {faculty.overallScore}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            faculty.attendanceRate >= 90
                              ? "bg-green-100 text-green-700"
                              : faculty.attendanceRate >= 80
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {faculty.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${faculty.syllabusCompletion}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {faculty.syllabusCompletion}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-gray-700">
                          {faculty.studentEngagement}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-gray-700">
                          {faculty.totalStudents}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-gray-700">
                          {faculty.feedbackCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award size={20} className="text-green-600" />
                <h3 className="font-semibold text-gray-800">Top Performers</h3>
              </div>
              <div className="space-y-4">
                {topPerformers.map((faculty, idx) => (
                  <div
                    key={faculty.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={faculty.name}
                          color={faculty.avatarColor}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {faculty.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {faculty.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="font-bold text-gray-800">
                        {faculty.overallScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle size={20} className="text-orange-600" />
                <h3 className="font-semibold text-gray-800">Needs Attention</h3>
              </div>
              <div className="space-y-4">
                {needsImprovement.map((faculty, idx) => (
                  <div
                    key={faculty.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={faculty.name}
                          color={faculty.avatarColor}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {faculty.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {faculty.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={14} className="text-gray-400" />
                        <span className="font-semibold text-gray-700">
                          {faculty.overallScore}
                        </span>
                      </div>
                      <p className="text-xs text-orange-600">
                        Follow-up required
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Key Insights & Recommendations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-60 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Strengths
                      </p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>
                        • Overall performance improved by 7% this semester
                      </li>
                      <li>• Student engagement is consistently above 85%</li>
                      <li>• Syllabus completion rate exceeds targets</li>
                    </ul>
                  </div>
                  <div className="bg-white bg-opacity-60 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown size={16} className="text-orange-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Action Items
                      </p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>
                        • Schedule feedback sessions with 3 faculty members
                      </li>
                      <li>
                        • Review teaching methodologies for low-rated subjects
                      </li>
                      <li>• Implement peer mentoring program</li>
                    </ul>
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

export default HodReport;
