import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useFaculty } from "../context/FacultyContext";

const DeleteConfirmModal = () => {
  const {
    isDeleteModalOpen,
    deletingFaculty,
    closeDeleteModal,
    confirmDeleteFaculty,
  } = useFaculty();

  if (!isDeleteModalOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        
        <button
          onClick={closeDeleteModal}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>

        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>

        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Delete Faculty
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete this faculty member?
        </p>

        
        {deletingFaculty && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="text-sm text-gray-800">
                  {deletingFaculty.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">ID:</span>
                <span className="text-sm text-gray-800">
                  {deletingFaculty.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Department:
                </span>
                <span className="text-sm text-gray-800">
                  {deletingFaculty.department}
                </span>
              </div>
            </div>
          </div>
        )}

        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-yellow-800">
            This action cannot be undone. All data associated with this faculty
            member will be permanently removed.
          </p>
        </div>

        
        <div className="flex gap-3">
          <button
            onClick={closeDeleteModal}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteFaculty}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
