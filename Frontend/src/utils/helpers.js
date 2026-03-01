import { EMAIL_DOMAIN } from "./constants";

export const generateEmailFromName = (fullName) => {
  const nameWithoutTitle = fullName.replace(
    /^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i,
    "",
  );
  const nameParts = nameWithoutTitle.trim().split(" ");

  if (nameParts.length >= 2) {
    const firstName = nameParts[0].toLowerCase();
    const surname = nameParts[nameParts.length - 1].toLowerCase();
    return `${firstName}.${surname}${EMAIL_DOMAIN}`;
  }

  return `${nameWithoutTitle.toLowerCase().replace(/\s+/g, ".")}${EMAIL_DOMAIN}`;
};

export const getFirstName = (fullName) => {
  const nameWithoutTitle = fullName.replace(
    /^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i,
    "",
  );
  return nameWithoutTitle.trim().split(" ")[0];
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
};

export const getInitials = (name) => {
  const nameWithoutTitle = name.replace(
    /^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i,
    "",
  );
  const parts = nameWithoutTitle.trim().split(" ");

  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getAuthStatus = () => {
  return {
    isAdmin: localStorage.getItem("isAdmin") === "true",
    isHOD: localStorage.getItem("isHOD") === "true",
    isFaculty: localStorage.getItem("isFaculty") === "true",
    role: localStorage.getItem("userRole"),
  };
};

export const clearAuth = () => {
  localStorage.clear();
};

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getAvatarColor = (seed) => {
  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-orange-200",
    "bg-pink-200",
    "bg-indigo-200",
  ];

  const index =
    seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};
