import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FacultyCard from "../components/FacultyCard";
import AddFacultyModal from "../components/AddFacultyModal";
import { useFaculty } from "../context/FacultyContext";
import {
  Search,
  Users,
  Star,
  Plus,
  Bell,
  ChevronRight,
  Settings,
} from "lucide-react";

const HodDashboard = () => {
  const hodDepartment = window.localStorage.getItem("hodDepartment") || "INFT";
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    getFilteredFacultyByDepartment,
    getDepartmentAnalytics,
    openAddModal,
  } = useFaculty();

  const departmentFaculty = useMemo(() => {
    return getFilteredFacultyByDepartment(hodDepartment, searchQuery);
  }, [hodDepartment, searchQuery, getFilteredFacultyByDepartment]);

  const displayedFaculty = useMemo(() => {
    return departmentFaculty.slice(0, 3);
  }, [departmentFaculty]);

  const analytics = useMemo(() => {
    return getDepartmentAnalytics(hodDepartment);
  }, [hodDepartment, getDepartmentAnalytics]);

  const { totalFaculty, avgScore } = analytics;

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

  const handleViewDetails = (faculty) => {
    navigate(`/hod-dashboard/faculty/${faculty.id}`);
  };

  const handleAddFaculty = () => {
    openAddModal();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="HOD" />
      <AddFacultyModal />
      <main className="flex-1 ml-60">
        <div className="px-10 py-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Department of {getDepartmentName(hodDepartment)}
              </h1>
              <p className="text-gray-500">Academic Year 2023-2024</p>
            </div>
            <button
              onClick={handleAddFaculty}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus size={18} />
              Add Faculty
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Total Faculty</p>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users size={18} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {totalFaculty}
                </h2>
                <span className="text-green-600 text-sm font-medium mb-1">
                  ↑ 2%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Dept Avg Score</p>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Star size={18} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {avgScore.toFixed(1)}
                </h2>
                <span className="text-xs text-gray-500 mb-1">/ 5.0</span>
                <span className="text-green-600 text-sm font-medium mb-1">
                  ↑ 0.1%
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search faculty by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedFaculty.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                onViewDetails={handleViewDetails}
              />
            ))}

            <button
              onClick={handleAddFaculty}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center min-h-50 group">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                <Plus
                  size={24}
                  className="text-gray-400 group-hover:text-blue-600"
                />
              </div>
              <h3 className="font-semibold text-gray-700 group-hover:text-blue-600 mb-1">
                Add New Faculty
              </h3>
              <p className="text-xs text-gray-500 text-center">
                Register a new professor to this department
              </p>
            </button>
          </div>

          {departmentFaculty.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No faculty members found in this department.
              </p>
            </div>
          )}

          {departmentFaculty.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No faculty members match your search.
              </p>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default HodDashboard;
