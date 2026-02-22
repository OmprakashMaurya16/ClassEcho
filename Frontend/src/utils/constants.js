// Department configurations
export const DEPARTMENTS = [
  { code: 'INFT', name: 'Information Technology', color: 'blue' },
  { code: 'CMPN', name: 'Computer Engineering', color: 'green' },
  { code: 'EXTC', name: 'Electronics & Telecommunication', color: 'purple' },
  { code: 'EXCS', name: 'Mechanical Engineering', color: 'orange' },
  { code: 'BIOMED', name: 'Biomedical Engineering', color: 'pink' },
  { code: 'FE', name: 'First Year Engineering', color: 'gray' },
];

// Designation options
export const DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Visiting Faculty',
  'Guest Lecturer',
];

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  HOD: 'HOD',
  FACULTY: 'Faculty',
};

// Department color mappings
export const DEPARTMENT_COLORS = {
  INFT: { bg: 'bg-blue-100', text: 'text-blue-700', avatar: 'bg-blue-200' },
  CMPN: { bg: 'bg-green-100', text: 'text-green-700', avatar: 'bg-green-200' },
  EXTC: { bg: 'bg-purple-100', text: 'text-purple-700', avatar: 'bg-purple-200' },
  EXCS: { bg: 'bg-orange-100', text: 'text-orange-700', avatar: 'bg-orange-200' },
  BIOMED: { bg: 'bg-pink-100', text: 'text-pink-700', avatar: 'bg-pink-200' },
  FE: { bg: 'bg-gray-100', text: 'text-gray-700', avatar: 'bg-gray-200' },
};

// Helper function to get department color
export const getDepartmentColor = (deptCode) => {
  return DEPARTMENT_COLORS[deptCode] || DEPARTMENT_COLORS.FE;
};

// Helper function to get full department name
export const getDepartmentName = (deptCode) => {
  const dept = DEPARTMENTS.find(d => d.code === deptCode);
  return dept ? dept.name : deptCode;
};

// Email domain
export const EMAIL_DOMAIN = '@vit.edu.in';

// Default password pattern for faculty
export const getDefaultPassword = (firstName) => `${firstName.toLowerCase()}123`;

// Chart colors
export const CHART_COLORS = {
  primary: 'rgb(59, 130, 246)',
  primaryLight: 'rgba(59, 130, 246, 0.1)',
  secondary: 'rgb(156, 163, 175)',
  secondaryLight: 'rgba(156, 163, 175, 0.1)',
  success: 'rgb(16, 185, 129)',
  successLight: 'rgba(16, 185, 129, 0.8)',
  warning: 'rgb(251, 191, 36)',
  warningLight: 'rgba(251, 191, 36, 0.8)',
  danger: 'rgb(239, 68, 68)',
  dangerLight: 'rgba(239, 68, 68, 0.8)',
};

// Sentiment types
export const SENTIMENT_TYPES = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
};

// Pagination defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
};
