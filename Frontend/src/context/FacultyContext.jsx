import React, { createContext, useContext, useState } from "react";
import { DEPARTMENTS, getDepartmentColor } from "../utils/constants";

const FacultyContext = createContext();

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error("useFaculty must be used within FacultyProvider");
  }
  return context;
};

export const FacultyProvider = ({ children }) => {
  const departments = DEPARTMENTS.map((dept) => dept.code);

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

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFaculty, setDeletingFaculty] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openEditModal = (faculty) => {
    setEditingFaculty(faculty);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFaculty(null);
  };

  const saveEditedFaculty = (updatedFaculty) => {
    setFacultyList((prevList) =>
      prevList.map((faculty) =>
        faculty.id === updatedFaculty.id
          ? { ...faculty, ...updatedFaculty }
          : faculty,
      ),
    );
    closeEditModal();
  };

  const openDeleteModal = (faculty) => {
    setDeletingFaculty(faculty);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingFaculty(null);
  };

  const confirmDeleteFaculty = () => {
    setFacultyList((prevList) =>
      prevList.filter((faculty) => faculty.id !== deletingFaculty.id),
    );
    closeDeleteModal();
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const addNewFaculty = (newFacultyData) => {
    const maxId = facultyList.reduce((max, faculty) => {
      const idNum = parseInt(faculty.id.split("-")[1]);
      return idNum > max ? idNum : max;
    }, 0);
    const newId = `FAC-${String(maxId + 1).padStart(3, "0")}`;

    const colors = getDepartmentColor(newFacultyData.department);
    const departmentColor = `${colors.bg} ${colors.text}`;
    const avatarColor = colors.avatar;

    const newFaculty = {
      id: newId,
      ...newFacultyData,
      departmentColor,
      avatarColor,
    };

    setFacultyList((prevList) => [...prevList, newFaculty]);
    closeAddModal();
  };

  const getFilteredFaculty = () => {
    let filtered = facultyList;

    if (departmentFilter && departmentFilter !== "All Department") {
      filtered = filtered.filter(
        (faculty) => faculty.department === departmentFilter,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(query) ||
          faculty.id.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const getPaginatedFaculty = () => {
    const filtered = getFilteredFaculty();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

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

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (department) => {
    setDepartmentFilter(department);
    setCurrentPage(1);
  };

  const getFacultyByDepartment = (department) => {
    return facultyList.filter((faculty) => faculty.department === department);
  };

  const getFilteredFacultyByDepartment = (department, searchTerm = "") => {
    let filtered = getFacultyByDepartment(department);

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(query) ||
          faculty.id.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const getDepartmentAnalytics = (department) => {
    const deptFaculty = getFacultyByDepartment(department);
    const totalFaculty = deptFaculty.length;

    const scores = deptFaculty.map(() => 3.9 + Math.random() * 1.0);
    const avgScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

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

    searchQuery,
    departmentFilter,
    handleSearchChange,
    handleDepartmentChange,

    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToNextPage,
    goToPreviousPage,
    getPaginatedFaculty,

    getFacultyByDepartment,
    getFilteredFacultyByDepartment,
    getDepartmentAnalytics,
  };

  return (
    <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>
  );
};
