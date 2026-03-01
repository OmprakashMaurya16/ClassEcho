import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useFaculty } from "../context/FacultyContext";

const EditFacultyModal = () => {
  const {
    isEditModalOpen,
    editingFaculty,
    closeEditModal,
    saveEditedFaculty,
    departments,
  } = useFaculty();

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    subjectsTaught: [],
  });

  const [newSubject, setNewSubject] = useState("");

  
  useEffect(() => {
    if (editingFaculty) {
      setFormData({
        name: editingFaculty.name || "",
        department: editingFaculty.department || "",
        designation: editingFaculty.designation || "",
        subjectsTaught: Array.isArray(editingFaculty.subjectsTaught)
          ? editingFaculty.subjectsTaught
          : editingFaculty.subjectsTaught
            ? [editingFaculty.subjectsTaught]
            : [],
      });
    }
  }, [editingFaculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubject = () => {
    if (
      newSubject.trim() &&
      !formData.subjectsTaught.includes(newSubject.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        subjectsTaught: [...prev.subjectsTaught, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjectsTaught: prev.subjectsTaught.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const updatedFaculty = {
      ...editingFaculty,
      ...formData,
    };
    saveEditedFaculty(updatedFaculty);
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        
        <button
          onClick={closeEditModal}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>

        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Faculty</h2>
        <p className="text-sm text-gray-500 mb-6">
          Update faculty information below
        </p>

        
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter faculty name"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments
                .filter((dept) => dept !== "FE")
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subjects Taught
            </label>

            
            {formData.subjectsTaught.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.subjectsTaught.map((subject, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(index)}
                      className="p-0.5 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddSubject())
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subject name"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>

        
        <div className="flex gap-3 mt-6">
          <button
            onClick={closeEditModal}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyModal;
