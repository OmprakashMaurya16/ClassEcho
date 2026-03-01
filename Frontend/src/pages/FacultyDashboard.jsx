import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFaculty } from "../context/FacultyContext";
import { useSession } from "../context/SessionContext";
import { QrCode, BarChart3, Clock, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import QRCodeModal from "../components/QRCodeModal";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { facultyList } = useFaculty();
  const { createSession, getFacultySessions, closeSession } = useSession();

  const facultyId = window.localStorage.getItem("facultyId");
  const facultyName = window.localStorage.getItem("facultyName");
  const facultyDepartment = window.localStorage.getItem("facultyDepartment");

  const [showQRModal, setShowQRModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showCourseSelection, setShowCourseSelection] = useState(false);

  const currentFaculty = useMemo(() => {
    return facultyList.find((f) => f.id === facultyId);
  }, [facultyList, facultyId]);

  const facultySessions = useMemo(() => {
    return getFacultySessions(facultyId);
  }, [getFacultySessions, facultyId]);

  const recentSessions = useMemo(() => {
    return facultySessions
      .slice(-5)
      .reverse()
      .map((session) => ({
        id: session.id,
        date: new Date(session.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        course: session.course,
        responses: session.responses?.length || 0,
        status: session.status === "active" ? "Active" : "Completed",
      }));
  }, [facultySessions]);

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

  const handleViewReport = () => {
    navigate(`/faculty/report/${facultyId}`);
  };

  const handleGenerateQR = () => {
    if (
      !currentFaculty?.subjectsTaught ||
      currentFaculty.subjectsTaught.length === 0
    ) {
      alert("No courses assigned to you");
      return;
    }

    if (currentFaculty.subjectsTaught.length === 1) {
      createSessionAndShowQR(currentFaculty.subjectsTaught[0]);
    } else {
      setShowCourseSelection(true);
    }
  };

  const createSessionAndShowQR = (course) => {
    const sessionId = createSession(
      facultyId,
      facultyName,
      course,
      getDepartmentName(facultyDepartment || currentFaculty?.department),
    );
    setCurrentSessionId(sessionId);
    setSelectedCourse(course);
    setShowCourseSelection(false);
    setShowQRModal(true);
  };

  const handleCloseSession = (sessionId) => {
    if (
      confirm(
        "Are you sure you want to end this session? Students will no longer be able to submit feedback.",
      )
    ) {
      closeSession(sessionId);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 ml-60 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 py-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  FACULTY PORTAL
                </p>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Welcome, {currentFaculty?.name || facultyName}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span className="text-base">
                    Department of{" "}
                    {getDepartmentName(
                      facultyDepartment || currentFaculty?.department,
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full opacity-20 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"></div>

              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  <QrCode size={32} className="text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Collect Feedback
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Generate a unique QR code for your current lecture session.
                  Students can scan it instantly to provide anonymous feedback.
                </p>

                <button
                  onClick={handleGenerateQR}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  <QrCode size={20} />
                  Generate New QR Code
                </button>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full opacity-20 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 right-10 w-32 h-32 bg-green-200 rounded-full opacity-10"></div>

              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  <BarChart3 size={32} className="text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Review Insights
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Access your analytics dashboard to see rating trends, read
                  student comments, and download semester reports.
                </p>

                <button
                  onClick={handleViewReport}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <BarChart3 size={20} />
                  View Report
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={24} className="text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900">
                Recent Sessions
              </h3>
            </div>

            <div className="overflow-hidden">
              {recentSessions.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Course
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Responses
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="text-gray-900 font-medium">
                            {session.date}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-700">
                            {session.course}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-gray-900 font-semibold">
                            {session.responses}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              session.status === "Active"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {session.status === "Active" ? (
                            <button
                              onClick={() => handleCloseSession(session.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                            >
                              End Session
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No sessions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Generate a QR code to start collecting feedback
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors">
                View All History
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <p>© 2023 Engineering Institute. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Support
                </a>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        sessionId={currentSessionId}
        course={selectedCourse}
        facultyName={facultyName}
      />

      {showCourseSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowCourseSelection(false)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Select Course
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose the course for this feedback session
            </p>

            <div className="space-y-3">
              {currentFaculty?.subjectsTaught?.map((course, index) => (
                <button
                  key={index}
                  onClick={() => createSessionAndShowQR(course)}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <p className="font-medium text-gray-900">{course}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCourseSelection(false)}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
