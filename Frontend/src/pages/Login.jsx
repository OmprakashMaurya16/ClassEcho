import React, { useState } from "react";
import RoleTabs from "../components/RoleTabs";
import InputField from "../components/InputField";
import LogoHeader from "../components/LogoHeader";
import Footer from "../components/Footer";
import { LockKeyhole, ArrowRight, Mail, Eye, EyeOff } from "lucide-react";
import { useFaculty } from "../context/FacultyContext";
import { generateEmailFromName, getFirstName } from "../utils/helpers";

const Login = () => {
  const { facultyList } = useFaculty();
  const [selectedRole, setSelectedRole] = useState("Faculty");
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      selectedRole === "Admin" &&
      (idOrEmail === "admin" || idOrEmail === "admin@institute.com") &&
      password === "admin123"
    ) {
      window.localStorage.setItem("isAdmin", "true");
      window.localStorage.setItem("userRole", "Admin");
      window.location.href = "/admin";
    } else if (selectedRole === "HOD") {
      const hodCredentials = {
        hod_inft: {
          password: "hod123",
          department: "INFT",
          name: "Dr. INFT Head",
        },
        hod_cmpn: {
          password: "hod123",
          department: "CMPN",
          name: "Dr. CMPN Head",
        },
        hod_extc: {
          password: "hod123",
          department: "EXTC",
          name: "Dr. EXTC Head",
        },
        hod_excs: {
          password: "hod123",
          department: "EXCS",
          name: "Dr. EXCS Head",
        },
        hod_biomed: {
          password: "hod123",
          department: "BIOMED",
          name: "Dr. BIOMED Head",
        },
      };

      const hodKey = idOrEmail.toLowerCase();
      if (
        hodCredentials[hodKey] &&
        password === hodCredentials[hodKey].password
      ) {
        window.localStorage.setItem("isHOD", "true");
        window.localStorage.setItem("userRole", "HOD");
        window.localStorage.setItem(
          "hodDepartment",
          hodCredentials[hodKey].department,
        );
        window.localStorage.setItem("hodName", hodCredentials[hodKey].name);
        window.location.href = "/hod-dashboard";
      } else {
        alert("Invalid HOD credentials.");
      }
    } else if (selectedRole === "Faculty") {
      const faculty = facultyList.find((f) => {
        const generatedEmail = generateEmailFromName(f.name);
        return generatedEmail === idOrEmail.toLowerCase();
      });

      if (faculty) {
        const firstName = getFirstName(faculty.name).toLowerCase();
        const expectedPassword = `${firstName}123`;

        if (password === expectedPassword) {
          window.localStorage.setItem("isFaculty", "true");
          window.localStorage.setItem("userRole", "Faculty");
          window.localStorage.setItem("facultyId", faculty.id);
          window.localStorage.setItem("facultyName", faculty.name);
          window.localStorage.setItem("facultyDepartment", faculty.department);
          window.location.href = "/faculty-dashboard";
        } else {
          alert("Invalid password.");
        }
      } else {
        alert("Invalid Faculty email.");
      }
    } else {
      alert("Invalid credentials or role.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <LogoHeader />
        <div className="w-full max-w-md px-8 py-5 bg-white rounded-2xl shadow-lg">
          <form className="w-full" onSubmit={handleLogin}>
            <h2 className="text-lg font-semibold text-center mb-0.5">
              Log in to your account
            </h2>
            <p className="text-gray-500 text-center text-sm mb-3">
              Please select your role to continue
            </p>
            <RoleTabs
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />
            <InputField
              label="Institute ID / Email"
              type="text"
              placeholder="Enter your ID or Email"
              value={idOrEmail}
              onChange={(e) => setIdOrEmail(e.target.value)}
              icon={<Mail size={18} />}
              autoComplete="username"
            />
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              icon={<LockKeyhole size={18} />}
              style={{ appearance: "none" }}
              className="hide-password-eye"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <div className="flex items-center justify-end mb-3">
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm shadow transition-colors duration-150">
              <ArrowRight size={18} />
              Secure Login
            </button>
          </form>
          <div className="w-full text-center mt-3 text-sm text-gray-500">
            Need help logging in?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact IT Support
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
