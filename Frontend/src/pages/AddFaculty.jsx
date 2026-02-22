import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../components/Footer";
import { useFaculty } from "../context/FacultyContext";
import { Plus, Trash2 } from "lucide-react";

const AddFaculty = () => {
  const { departments, addNewFaculty } = useFaculty();
  const [form, setForm] = useState({
    name: "",
    department: "",
    email: "",
    designation: "",
    subjectsTaught: [],
  });
  
  const [newSubject, setNewSubject] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !form.subjectsTaught.includes(newSubject.trim())) {
      setForm((prev) => ({
        ...prev,
        subjectsTaught: [...prev.subjectsTaught, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (index) => {
    setForm((prev) => ({
      ...prev,
      subjectsTaught: prev.subjectsTaught.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.subjectsTaught.length === 0) {
      toast.error("Please add at least one subject");
      return;
    }
    
    // TODO: Add API call here
    // try {
    //   await facultyAPI.create(form);
    //   toast.success("Faculty added successfully!");
    // } catch (error) {
    //   toast.error("Failed to add faculty");
    // }
    
    addNewFaculty(form);
    toast.success("Faculty added successfully!");
    setForm({ 
      name: "", 
      department: "", 
      email: "", 
      designation: "",
      subjectsTaught: [],
    });
    setNewSubject("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-60">
        {/* Topbar */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Add Faculty</h2>
            <p className="text-gray-500 text-sm">Add a new faculty member to the directory</p>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 px-10 py-8 flex justify-center items-start">
          <form
            className="w-full max-w-lg bg-white rounded-2xl shadow p-8"
            onSubmit={handleSubmit}
          >
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of Faculty</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter faculty name"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter faculty email"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            {/* Subjects Taught */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects Taught <span className="text-red-500">*</span>
              </label>
              
              {/* List of existing subjects */}
              {form.subjectsTaught.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.subjectsTaught.map((subject, index) => (
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
                  className="flex-1 py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter subject name"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-base shadow transition-colors duration-150"
            >
              Add Faculty
            </button>
          </form>
        </div>
        <Footer className="mb-10"/>

        <ToastContainer position="bottom-right" autoClose={2000} />
      </main>
    </div>
  );
};

export default AddFaculty;
