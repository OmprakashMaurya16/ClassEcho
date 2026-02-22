import React from "react";
import Avatar from "./Avatar";
import { Pencil, Trash2 } from "lucide-react";
import { useFaculty } from "../context/FacultyContext";

const FacultyTable = () => {
  const { 
    getPaginatedFaculty, 
    openEditModal, 
    openDeleteModal,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToNextPage,
    goToPreviousPage
  } = useFaculty();
  
  const displayedFaculty = getPaginatedFaculty();
  
  return (
  <div className="bg-white rounded-2xl shadow-sm p-0 mt-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="text-left text-xs text-gray-500">
          <th className="px-6 py-3 font-semibold">Name</th>
          <th className="px-6 py-3 font-semibold">Department</th>
          <th className="px-6 py-3 font-semibold">Course Assignment</th>
          <th className="px-6 py-3 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {displayedFaculty.length > 0 ? (
          displayedFaculty.map((f, idx) => (
          <tr key={f.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 flex items-center gap-3">
              <Avatar name={f.name} color={f.avatarColor} />
              <div>
                <div className="font-medium text-gray-800 text-sm">
                  {f.name}
                </div>
                <div className="text-xs text-gray-400">ID: {f.id}</div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${f.departmentColor}`}
              >
                {f.department}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">
              {Array.isArray(f.subjectsTaught) 
                ? f.subjectsTaught.length > 2 
                  ? f.subjectsTaught.slice(0, 2).join(", ") + ", ..."
                  : f.subjectsTaught.join(", ")
                : f.subjectsTaught}
            </td>
            <td className="px-6 py-4 flex gap-2">
              <button 
                onClick={() => openEditModal(f)}
                className="p-2 rounded hover:bg-blue-50 text-blue-600"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => openDeleteModal(f)}
                className="p-2 rounded hover:bg-red-50 text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
              No faculty members found
            </td>
          </tr>
        )}
      </tbody>
    </table>
    <div className="flex items-center justify-between px-6 py-3 text-xs text-gray-500 bg-gray-50 rounded-b-2xl">
      <span>
        {totalItems > 0 
          ? `Showing ${startIndex} to ${endIndex} of ${totalItems} results`
          : "No results to display"
        }
      </span>
      <div className="flex gap-2">
        <button 
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-200 bg-white cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-gray-700">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded border border-gray-200 bg-white cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
}

export default FacultyTable;
