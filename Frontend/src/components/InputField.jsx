import React from "react";

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  rightIcon,
  autoComplete,
}) => {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200
            ${icon ? "pl-10" : "pl-3"}
            ${rightIcon ? "pr-10" : "pr-3"}
          `}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
