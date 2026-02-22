import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { FacultyProvider } from "./context/FacultyContext";

import Login from "./pages/Login";
import ManageFaculty from "./pages/ManageFaculty";
import AddFaculty from "./pages/AddFaculty";
import AdminDashboard from "./pages/AdminDashboard";
import HodDashboard from "./pages/HodDashboard";
import HodFacultyList from "./pages/HodFacultyList";
import FacultyReport from "./pages/FacultyReport";
import HodReport from "./pages/HodReport";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyReportPage from "./pages/FacultyReportPage";


const PrivateRoute = ({ children }) => {
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/" replace />;
};

const HodPrivateRoute = ({ children }) => {
  const isHOD = window.localStorage.getItem("isHOD") === "true";
  return isHOD ? children : <Navigate to="/" replace />;
};

const FacultyPrivateRoute = ({ children }) => {
  const isFaculty = window.localStorage.getItem("isFaculty") === "true";
  return isFaculty ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <FacultyProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>}/>
        <Route path="/admin/manage-faculty" element={<PrivateRoute><ManageFaculty /></PrivateRoute>}/>
        <Route path="/admin/add-faculty" element={<PrivateRoute><AddFaculty /></PrivateRoute>}/>
        <Route path="/hod-dashboard" element={<HodPrivateRoute><HodDashboard /></HodPrivateRoute>}/>
        <Route path="/hod-dashboard/faculty" element={<HodPrivateRoute><HodFacultyList /></HodPrivateRoute>}/>
        <Route path="/hod-dashboard/faculty/:id" element={<HodPrivateRoute><FacultyReport /></HodPrivateRoute>}/>
        <Route path="/hod-dashboard/reports" element={<HodPrivateRoute><HodReport /></HodPrivateRoute>}/>
        <Route path="/faculty-dashboard" element={<FacultyPrivateRoute><FacultyDashboard /></FacultyPrivateRoute>}/>
        <Route path="/faculty/report/:id" element={<FacultyPrivateRoute><FacultyReportPage /></FacultyPrivateRoute>}/>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </FacultyProvider>
  );
};

export default App;
