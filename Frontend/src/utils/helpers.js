import { EMAIL_DOMAIN } from './constants';

/**
 * Generate email from faculty name
 * @param {string} fullName - Full name of faculty (e.g., "Dr. Sushopti Gawade")
 * @returns {string} - Generated email (e.g., "sushopti.gawade@vit.edu.in")
 */
export const generateEmailFromName = (fullName) => {
  // Remove titles like Dr., Prof., etc.
  const nameWithoutTitle = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
  const nameParts = nameWithoutTitle.trim().split(' ');
  
  if (nameParts.length >= 2) {
    const firstName = nameParts[0].toLowerCase();
    const surname = nameParts[nameParts.length - 1].toLowerCase();
    return `${firstName}.${surname}${EMAIL_DOMAIN}`;
  }
  
  return `${nameWithoutTitle.toLowerCase().replace(/\s+/g, '.')}${EMAIL_DOMAIN}`;
};

/**
 * Extract first name from full name
 * @param {string} fullName - Full name
 * @returns {string} - First name
 */
export const getFirstName = (fullName) => {
  const nameWithoutTitle = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
  return nameWithoutTitle.trim().split(' ')[0];
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date object or string
 * @returns {string} - Formatted date (e.g., "Feb 20, 2026")
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Calculate average from array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} - Average rounded to 1 decimal
 */
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (e.g., "SG")
 */
export const getInitials = (name) => {
  const nameWithoutTitle = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
  const parts = nameWithoutTitle.trim().split(' ');
  
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if user is authenticated
 * @returns {object} - Authentication status and role
 */
export const getAuthStatus = () => {
  return {
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    isHOD: localStorage.getItem('isHOD') === 'true',
    isFaculty: localStorage.getItem('isFaculty') === 'true',
    role: localStorage.getItem('userRole'),
  };
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.clear();
};

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} - Percentage rounded to nearest integer
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Generate random color for avatar
 * @param {string} seed - Seed string for consistent colors
 * @returns {string} - Tailwind color class
 */
export const getAvatarColor = (seed) => {
  const colors = [
    'bg-blue-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-orange-200',
    'bg-pink-200',
    'bg-indigo-200',
  ];
  
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};
