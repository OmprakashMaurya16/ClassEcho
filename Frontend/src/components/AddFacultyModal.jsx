import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useFaculty } from "../context/FacultyContext";

const AddFacultyModal = () => {
  const { isAddModalOpen, closeAddModal, addNewFaculty, departments } = useFaculty();
  const hodDepartment = window.localStorage.getItem("hodDepartment") || "INFT";
  
  const [formData, setFormData] = useState({
    name: "",
    department: hodDepartment,
    designation: "",
    subjectsTaught: [],
  });
  
  const [newSubject, setNewSubject] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjectsTaught.includes(newSubject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjectsTaught: [...prev.subjectsTaught, newSubject.trim()],
      }));
      setNewSubject("");
      if (errors.subjectsTaught) {
        setErrors((prev) => ({
          ...prev,
          subjectsTaught: "",
        }));
      }
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjectsTaught: prev.subjectsTaught.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Faculty name is required";
    }
    
    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }
    
    if (formData.subjectsTaught.length === 0) {
      newErrors.subjectsTaught = "At least one subject is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      addNewFaculty(formData);
      // Reset form
      setFormData({
        name: "",
        department: hodDepartment,
        designation: "",
        subjectsTaught: [],
      });
      setNewSubject("");
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      department: hodDepartment,
      designation: "",
      subjectsTaught: [],
    });
    setNewSubject("");
    setErrors({});
    closeAddModal();
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Faculty</h2>
        <p className="text-sm text-gray-500 mb-6">Enter faculty information below</p>

        {/* Form */}
        <div className="space-y-4">
          {/* Faculty Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter faculty name"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.designation ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
            {errors.designation && (
              <p className="text-xs text-red-500 mt-1">{errors.designation}</p>
            )}
          </div>

          {/* Subjects Taught */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subjects Taught <span className="text-red-500">*</span>
            </label>
            
            {/* List of existing subjects */}
            {formData.subjectsTaught.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.subjectsTaught.map((subject, index) => (
                  <div key={index} className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
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
            
            {/* Add new subject */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
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
            {errors.subjectsTaught && (
              <p className="text-xs text-red-500 mt-1">{errors.subjectsTaught}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Faculty
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFacultyModal;
