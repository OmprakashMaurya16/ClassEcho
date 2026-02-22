import React from "react";

const RoleTabs = ({ selectedRole, onSelectRole }) => {
  const roles = ["Admin", "HOD", "Faculty"];
  return (
    <div className="flex mb-6 bg-gray-100 rounded-md py-1.5 px-1 justify-around">
      {roles.map((role) => (
        <button
          key={role}
          className={`w-30 py-2 rounded-md font-medium focus:outline-none transition-colors duration-150 cursor-pointer ${
            selectedRole === role
              ? "bg-white text-blue-600"
              : " text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => onSelectRole(role)}
          type="button"
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default RoleTabs;
