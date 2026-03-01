import React from "react";

const Avatar = ({ name, color, size = "md" }) => {
  const initials = name
    .replace(/\b(dr|mr|mrs|ms|prof)\.?/gi, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-9 h-9 text-base",
    lg: "w-12 h-12 text-lg",
  };
  
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]} ${color}`}
    >
      {initials}
    </span>
  );
};

export default Avatar;
