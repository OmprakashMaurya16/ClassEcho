import React from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import FacultyTable from "../components/FacultyTable";
import Footer from "../components/Footer";
import EditFacultyModal from "../components/EditFacultyModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useFaculty } from "../context/FacultyContext";
import { Bell } from "lucide-react";

const ManageFaculty = () => {
  const {
    searchQuery,
    departmentFilter,
    handleSearchChange,
    handleDepartmentChange,
    departments,
  } = useFaculty();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-60">
        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Faculty Directory
            </h2>
            <p className="text-gray-500 text-sm">
              Manage all registered faculty members
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <Bell size={20} color="gray" />
            </button>
          </div>
        </div>
        <div className="flex-1 px-10 py-8">
          <div className="flex items-center gap-4 mb-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <select
              value={departmentFilter}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600"
            >
              <option>All Department</option>
              {departments
                .filter((dept) => dept !== "FE")
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>
          <FacultyTable />
          <Footer />
        </div>
      </main>

      <EditFacultyModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default ManageFaculty;
