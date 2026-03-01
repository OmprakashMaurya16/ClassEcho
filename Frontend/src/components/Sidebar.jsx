import React from "react";
import {
  User,
  Users,
  FileText,
  LogOut,
  Plus,
  BarChart2,
  GraduationCap,
  PenTool,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ role = "Admin" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = role || window.localStorage.getItem("userRole") || "Admin";
  const hodDepartment = window.localStorage.getItem("hodDepartment") || "";
  const hodName = window.localStorage.getItem("hodName") || "HOD User";
  const facultyName =
    window.localStorage.getItem("facultyName") || "Faculty User";
  const facultyId = window.localStorage.getItem("facultyId") || "";
  const facultyDepartment =
    window.localStorage.getItem("facultyDepartment") || "";

  const adminNavItems = [
    {
      label: "Dashboard",
      icon: <Users size={18} />,
      path: "/admin",
      active: location.pathname === "/admin",
    },
    {
      label: "Add Faculty",
      icon: <Plus size={18} />,
      path: "/admin/add-faculty",
      active: location.pathname === "/admin/add-faculty",
    },
    {
      label: "Manage Faculty",
      icon: <User size={18} />,
      path: "/admin/manage-faculty",
      active: location.pathname === "/admin/manage-faculty",
    },
  ];

  const hodNavItems = [
    {
      label: "Dashboard",
      icon: <Users size={18} />,
      path: "/hod-dashboard",
      active: location.pathname === "/hod-dashboard",
    },
    {
      label: "Faculty",
      icon: <User size={18} />,
      path: "/hod-dashboard/faculty",
      active: location.pathname === "/hod-dashboard/faculty",
    },
    {
      label: "Reports",
      icon: <BarChart2 size={18} />,
      path: "/hod-dashboard/reports",
      active: location.pathname === "/hod-dashboard/reports",
    },
  ];

  const facultyNavItems = [
    {
      label: "Dashboard",
      icon: <Users size={18} />,
      path: "/faculty-dashboard",
      active: location.pathname === "/faculty-dashboard",
    },
    {
      label: "My Report",
      icon: <BarChart2 size={18} />,
      path: `/faculty/report/${facultyId}`,
      active: location.pathname.startsWith("/faculty/report/"),
    },
    {
      label: "Student Tests",
      icon: <PenTool size={18} />,
      path: "/faculty/assessment/create",
      active: location.pathname.startsWith("/faculty/assessment"),
    },
  ];

  const navItems =
    userRole === "HOD"
      ? hodNavItems
      : userRole === "Faculty"
        ? facultyNavItems
        : adminNavItems;

  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="fixed top-0 left-0 flex flex-col h-screen w-60 bg-white border-r border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-10 py-6 border-b border-gray-100">
        <div className="rounded-md bg-blue-200 p-2">
          <GraduationCap size={20} color="blue" />
        </div>
        <span className="font-bold text-lg text-gray-800">ClassEcho</span>
      </div>
      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-lg mb-1 text-base font-medium transition-colors duration-150 cursor-pointer ${
              item.active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => item.path !== "#" && navigate(item.path)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-gray-100">
        <div className="px-4 py-4 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold text-lg">
            {userRole === "HOD" ? "H" : userRole === "Faculty" ? "F" : "A"}
          </span>
          <div className="flex flex-col cursor-pointer">
            <span className="font-medium text-sm text-gray-800">
              {userRole === "HOD"
                ? hodName
                : userRole === "Faculty"
                  ? facultyName
                  : "Admin User"}
            </span>
            <span className="text-xs text-gray-400">
              {userRole === "HOD"
                ? `HOD (${hodDepartment})`
                : userRole === "Faculty"
                  ? facultyDepartment
                  : "Engineering Inst."}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-red-500 cursor-pointer text-sm font-medium w-full hover:bg-gray-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
