import { createContext, useContext, useState } from "react";

const ROLE_REDIRECTS = {
  Admin: "/admin/dashboard",
  HOD: "/hod/dashboard",
  Faculty: "/faculty/dashboard",
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("vit_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (role, email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const payload = await res.json();
      const backendUser = payload?.data?.user;
      const token = payload?.data?.accessToken;

      if (!res.ok || !backendUser || !token) {
        return {
          success: false,
          message: payload?.message || "Invalid email or password.",
        };
      }

      if (backendUser.role !== role) {
        return {
          success: false,
          message: `This account is not a ${role}. Please choose ${backendUser.role}.`,
        };
      }

      const safeUser = {
        id: backendUser.id,
        role: backendUser.role,
        email: backendUser.email,
        department: backendUser.department,
        name: backendUser.fullName,
        fullName: backendUser.fullName,
        token,
        refreshToken: payload?.data?.refreshToken,
        redirectTo: ROLE_REDIRECTS[backendUser.role] || "/login",
      };

      sessionStorage.setItem("vit_user", JSON.stringify(safeUser));
      setUser(safeUser);

      return { success: true, redirectTo: safeUser.redirectTo };
    } catch {
      return {
        success: false,
        message: "Unable to connect to server. Please try again.",
      };
    }
  };

  const logout = async () => {
    const token = user?.token;

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
    } catch {
    } finally {
      sessionStorage.removeItem("vit_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
