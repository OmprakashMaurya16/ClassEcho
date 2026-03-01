import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
};

export const facultyAPI = {
  getAll: () => api.get("/faculty"),
  getById: (id) => api.get(`/faculty/${id}`),
  getByDepartment: (department) => api.get(`/faculty/department/${department}`),
  create: (facultyData) => api.post("/faculty", facultyData),
  update: (id, facultyData) => api.put(`/faculty/${id}`, facultyData),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const feedbackAPI = {
  getByFaculty: (facultyId) => api.get(`/feedback/faculty/${facultyId}`),
  getByDepartment: (department) =>
    api.get(`/feedback/department/${department}`),
  create: (feedbackData) => api.post("/feedback", feedbackData),
  getAnalytics: (facultyId) => api.get(`/feedback/analytics/${facultyId}`),
};

export const departmentAPI = {
  getAll: () => api.get("/departments"),
  getAnalytics: (department) => api.get(`/departments/${department}/analytics`),
};

export const sessionAPI = {
  getByFaculty: (facultyId) => api.get(`/sessions/faculty/${facultyId}`),
  create: (sessionData) => api.post("/sessions", sessionData),
  generateQR: (sessionId) => api.get(`/sessions/${sessionId}/qr`),
};

export default api;
