import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FacultyCard from "../components/FacultyCard";
import { useFaculty } from "../context/FacultyContext";
import { Search, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HodFacultyList = () => {
  const hodDepartment = window.localStorage.getItem("hodDepartment") || "INFT";
  const [searchQuery, setSearchQuery] = useState("");
  const { getFilteredFacultyByDepartment, getDepartmentAnalytics } =
    useFaculty();
  const navigate = useNavigate();

  const departmentFaculty = useMemo(() => {
    return getFilteredFacultyByDepartment(hodDepartment, searchQuery);
  }, [hodDepartment, searchQuery, getFilteredFacultyByDepartment]);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="HOD" />
      <main className="flex-1 ml-60">
        <div className="px-10 py-8 bg-white border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Department of {getDepartmentName(hodDepartment)} Faculty List
          </h1>
          <p className="text-gray-500">Academic Year 2023-2024</p>
        </div>

        <div className="px-10 py-8">
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
            {departmentFaculty.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                onViewDetails={handleViewDetails}
              />
            ))}
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

export default HodFacultyList;
