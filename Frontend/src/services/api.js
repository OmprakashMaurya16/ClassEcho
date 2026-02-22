import axios from 'axios';

// Base URL for API - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear localStorage and redirect to login
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

// Faculty API
export const facultyAPI = {
  getAll: () => api.get('/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  getByDepartment: (department) => api.get(`/faculty/department/${department}`),
  create: (facultyData) => api.post('/faculty', facultyData),
  update: (id, facultyData) => api.put(`/faculty/${id}`, facultyData),
  delete: (id) => api.delete(`/faculty/${id}`),
};

// Feedback API
export const feedbackAPI = {
  getByFaculty: (facultyId) => api.get(`/feedback/faculty/${facultyId}`),
  getByDepartment: (department) => api.get(`/feedback/department/${department}`),
  create: (feedbackData) => api.post('/feedback', feedbackData),
  getAnalytics: (facultyId) => api.get(`/feedback/analytics/${facultyId}`),
};

// Department API
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getAnalytics: (department) => api.get(`/departments/${department}/analytics`),
};

// Session API
export const sessionAPI = {
  getByFaculty: (facultyId) => api.get(`/sessions/faculty/${facultyId}`),
  create: (sessionData) => api.post('/sessions', sessionData),
  generateQR: (sessionId) => api.get(`/sessions/${sessionId}/qr`),
};

export default api;
