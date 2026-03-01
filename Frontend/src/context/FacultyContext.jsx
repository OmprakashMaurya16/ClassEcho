import React, { createContext, useContext, useState } from "react";
import { DEPARTMENTS, getDepartmentColor } from "../utils/constants";

// TODO: Replace mock data with API calls when backend is ready
// import { facultyAPI } from '../services/api';

const FacultyContext = createContext();

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error("useFaculty must be used within FacultyProvider");
  }
  return context;
};

export const FacultyProvider = ({ children }) => {
  // ============= STATE MANAGEMENT =============
  
  // Department list from constants
  const departments = DEPARTMENTS.map(dept => dept.code);

  // Faculty list state (TODO: Fetch from API on mount)
  const [facultyList, setFacultyList] = useState([
    {
      id: "FAC-001",
      name: "Dr. Sushopti Gawade",
      department: "INFT",
      designation: "Professor",
      subjectsTaught: ["Machine Learning", "Data Science"],
      departmentColor: "bg-blue-100 text-blue-700",
      avatarColor: "bg-blue-200",
    },
    {
      id: "FAC-002",
      name: "Prof. Amit Aylani",
      department: "CMPN",
      designation: "Associate Professor",
      subjectsTaught: ["Advanced Data Structures", "Algorithms"],
      departmentColor: "bg-green-100 text-green-700",
      avatarColor: "bg-green-200",
    },
    {
      id: "FAC-003",
      name: "Dr. Priya Sharma",
      department: "INFT",
      designation: "Associate Professor",
      subjectsTaught: ["Database Systems", "Cloud Computing"],
      departmentColor: "bg-blue-100 text-blue-700",
      avatarColor: "bg-blue-200",
    },
    {
      id: "FAC-004",
      name: "Prof. Rajesh Kumar",
      department: "CMPN",
      designation: "Professor",
      subjectsTaught: ["Computer Networks", "Cyber Security"],
      departmentColor: "bg-green-100 text-green-700",
      avatarColor: "bg-green-200",
    },
    {
      id: "FAC-005",
      name: "Dr. Anita Desai",
      department: "EXTC",
      designation: "Professor",
      subjectsTaught: ["Digital Communications", "Wireless Networks"],
      departmentColor: "bg-purple-100 text-purple-700",
      avatarColor: "bg-purple-200",
    },
    {
      id: "FAC-006",
      name: "Prof. Vikram Mehta",
      department: "EXCS",
      designation: "Associate Professor",
      subjectsTaught: ["Fluid Mechanics", "Heat Transfer"],
      departmentColor: "bg-orange-100 text-orange-700",
      avatarColor: "bg-orange-200",
    },
    {
      id: "FAC-007",
      name: "Dr. Sneha Joshi",
      department: "BIOMED",
      designation: "Assistant Professor",
      subjectsTaught: ["Medical Imaging", "Biomedical Instrumentation"],
      departmentColor: "bg-pink-100 text-pink-700",
      avatarColor: "bg-pink-200",
    },
    {
      id: "FAC-008",
      name: "Dr. Raj Patel",
      department: "EXCS",
      designation: "Professor",
      subjectsTaught: ["Thermodynamics II"],
      departmentColor: "bg-orange-100 text-orange-700",
      avatarColor: "bg-orange-200",
    },
    {
      id: "FAC-009",
      name: "Prof. Kavita Singh",
      department: "INFT",
      designation: "Lecturer",
      subjectsTaught: ["Web Development", "Mobile Apps"],
      departmentColor: "bg-blue-100 text-blue-700",
      avatarColor: "bg-blue-200",
    },
    {
      id: "FAC-010",
      name: "Dr. Arun Verma",
      department: "CMPN",
      designation: "Professor",
      subjectsTaught: ["Operating Systems", "Compiler Design"],
      departmentColor: "bg-green-100 text-green-700",
      avatarColor: "bg-green-200",
    },
    {
      id: "FAC-011",
      name: "Prof. Neha Gupta",
      department: "EXTC",
      designation: "Associate Professor",
      subjectsTaught: ["Microprocessors", "Embedded Systems"],
      departmentColor: "bg-purple-100 text-purple-700",
      avatarColor: "bg-purple-200",
    },
    {
      id: "FAC-012",
      name: "Dr. Yogesh Patil",
      department: "EXTC",
      designation: "Assistant Professor",
      subjectsTaught: ["Circuit Analysis", "Signal Processing"],
      departmentColor: "bg-purple-100 text-purple-700",
      avatarColor: "bg-purple-200",
    },
    {
      id: "FAC-013",
      name: "Prof. Meera Nair",
      department: "BIOMED",
      designation: "Professor",
      subjectsTaught: ["Biomechanics", "Tissue Engineering"],
      departmentColor: "bg-pink-100 text-pink-700",
      avatarColor: "bg-pink-200",
    },
    {
      id: "FAC-014",
      name: "Dr. Karan Shah",
      department: "EXCS",
      designation: "Assistant Professor",
      subjectsTaught: ["Mechanical Vibrations", "CAD/CAM"],
      departmentColor: "bg-orange-100 text-orange-700",
      avatarColor: "bg-orange-200",
    },
    {
      id: "FAC-015",
      name: "Prof. Dhanashree Tamhane",
      department: "BIOMED",
      designation: "Professor",
      subjectsTaught: ["Biotechnology"],
      departmentColor: "bg-pink-100 text-pink-700",
      avatarColor: "bg-pink-200",
    },
  ]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFaculty, setDeletingFaculty] = useState(null);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Open edit modal with faculty data
  const openEditModal = (faculty) => {
    setEditingFaculty(faculty);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFaculty(null);
  };

  // Save edited faculty
  const saveEditedFaculty = (updatedFaculty) => {
    // TODO: Replace with API call
    // await facultyAPI.update(updatedFaculty.id, updatedFaculty);
    
    setFacultyList((prevList) =>
      prevList.map((faculty) =>
        faculty.id === updatedFaculty.id ? { ...faculty, ...updatedFaculty } : faculty
      )
    );
    closeEditModal();
  };

  // Open delete confirmation modal
  const openDeleteModal = (faculty) => {
    setDeletingFaculty(faculty);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingFaculty(null);
  };

  // Confirm delete faculty
  const confirmDeleteFaculty = () => {
    // TODO: Replace with API call
    // await facultyAPI.delete(deletingFaculty.id);
    
    setFacultyList((prevList) =>
      prevList.filter((faculty) => faculty.id !== deletingFaculty.id)
    );
    closeDeleteModal();
  };

  // Open add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Close add modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Add new faculty
  const addNewFaculty = (newFacultyData) => {
    // Generate new faculty ID
    const maxId = facultyList.reduce((max, faculty) => {
      const idNum = parseInt(faculty.id.split('-')[1]);
      return idNum > max ? idNum : max;
    }, 0);
    const newId = `FAC-${String(maxId + 1).padStart(3, '0')}`;

    // Get department colors from constants
    const colors = getDepartmentColor(newFacultyData.department);
    const departmentColor = `${colors.bg} ${colors.text}`;
    const avatarColor = colors.avatar;

    const newFaculty = {
      id: newId,
      ...newFacultyData,
      departmentColor,
      avatarColor,
    };

    // TODO: Replace with API call
    // await facultyAPI.create(newFaculty);

    setFacultyList((prevList) => [...prevList, newFaculty]);
    closeAddModal();
  };

  // Filter and search logic
  const getFilteredFaculty = () => {
    let filtered = facultyList;

    // Apply department filter
    if (departmentFilter && departmentFilter !== "All Department") {
      filtered = filtered.filter((faculty) => faculty.department === departmentFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(query) ||
          faculty.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get paginated data
  const getPaginatedFaculty = () => {
    const filtered = getFilteredFaculty();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Pagination helpers
  const totalItems = getFilteredFaculty().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when search or filter changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (department) => {
    setDepartmentFilter(department);
    setCurrentPage(1);
  };

  // Get faculty by specific department (for HOD)
  const getFacultyByDepartment = (department) => {
    return facultyList.filter((faculty) => faculty.department === department);
  };

  // Get filtered faculty by department with search
  const getFilteredFacultyByDepartment = (department, searchTerm = "") => {
    let filtered = getFacultyByDepartment(department);
    
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(query) ||
          faculty.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Calculate department analytics
  const getDepartmentAnalytics = (department) => {
    const deptFaculty = getFacultyByDepartment(department);
    const totalFaculty = deptFaculty.length;
    
    // Simulated average score calculation
    const scores = deptFaculty.map(() => 3.9 + Math.random() * 1.0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    return {
      totalFaculty,
      avgScore,
      faculty: deptFaculty,
    };
  };

  const value = {
    facultyList,
    departments,
    isEditModalOpen,
    editingFaculty,
    isDeleteModalOpen,
    deletingFaculty,
    isAddModalOpen,
    openEditModal,
    closeEditModal,
    saveEditedFaculty,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteFaculty,
    openAddModal,
    closeAddModal,
    addNewFaculty,
    // Search and filter
    searchQuery,
    departmentFilter,
    handleSearchChange,
    handleDepartmentChange,
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToNextPage,
    goToPreviousPage,
    getPaginatedFaculty,
    // Department specific (for HOD)
    getFacultyByDepartment,
    getFilteredFacultyByDepartment,
    getDepartmentAnalytics,
  };

  return (
    <FacultyContext.Provider value={value}>
      {children}
    </FacultyContext.Provider>
  );
};
