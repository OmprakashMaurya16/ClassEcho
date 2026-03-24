import { User, Mail, Shield, AlertCircle } from "lucide-react";
export const DEPARTMENTS = ["INFT", "CMPN", "EXTC", "EXCS", "BIOMED", "FE"];

export const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Guest Faculty",
];
export const EMPTY_FACULTY_FORM = {
  fullName: "",
  email: "",
  department: "",
  designation: "",
  role: "Faculty",
};
export const inputCls = (err) =>
  `w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
    err
      ? "border-red-300 focus:ring-red-400"
      : "border-gray-200 focus:ring-indigo-400"
  }`;

export const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="font-medium text-gray-600"
      style={{ fontSize: "clamp(0.72rem, 1.4vw, 0.875rem)" }}>
      {label}
    </label>
    {children}
    {error && (
      <p
        className="flex items-center gap-1 text-red-500 mt-0.5"
        style={{ fontSize: "clamp(0.65rem, 1.2vw, 0.75rem)" }}>
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);
const Select = ({ value, onChange, options, placeholder, error, disabled }) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`${inputCls(error)} ${
      !value ? "text-gray-400" : "text-gray-800"
    } ${disabled ? "bg-gray-50 cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
    style={{ fontSize: "clamp(0.72rem, 1.4vw, 0.875rem)" }}>
    <option value="" disabled>
      {placeholder}
    </option>
    {options.map((o) => (
      <option key={o} value={o} className="text-gray-800">
        {o}
      </option>
    ))}
  </select>
);
export const validateFacultyForm = (f, mode = "add") => {
  const e = {};

  if (!f.fullName.trim()) e.fullName = "Full name is required";
  else if (f.fullName.trim().length < 3)
    e.fullName = "Name must be at least 3 characters";
  else if (f.fullName.trim().length > 50)
    e.fullName = "Name must be under 50 characters";

  if (mode === "add") {
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email))
      e.email = "Enter a valid email address";
  }

  if (!f.department) e.department = "Department is required";

  if (!f.role) e.role = "Role is required";
  if (f.role === "Faculty" && !f.designation)
    e.designation = "Designation is required";

  return e;
};
const FacultyForm = ({ form, setForm, errors = {}, mode = "add" }) => {
  const handleRoleChange = (e) =>
    setForm((f) => ({ ...f, role: e.target.value, designation: "" }));
  const fs = { fontSize: "clamp(0.72rem, 1.4vw, 0.875rem)" };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Faculty Name" error={errors.fullName}>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={form.fullName}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
              placeholder="e.g. Dr. Rajesh Kumar"
              className={`${inputCls(errors.fullName)} pl-10`}
              style={fs}
            />
          </div>
        </Field>

        <Field label="Email ID" error={errors.email}>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="e.g. rajesh.kumar@vit.edu.in"
              readOnly={mode === "edit"}
              className={`${inputCls(errors.email)} pl-10 ${
                mode === "edit"
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed select-none"
                  : ""
              }`}
              style={fs}
            />
          </div>
          {mode === "edit" && (
            <p
              className="text-gray-400 -mt-0.5"
              style={{ fontSize: "clamp(0.62rem, 1.1vw, 0.72rem)" }}>
              Email cannot be changed after registration.
            </p>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Department" error={errors.department}>
          <Select
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
            options={DEPARTMENTS}
            placeholder="Select Department"
            error={errors.department}
          />
        </Field>

        <Field label="Designation" error={errors.designation}>
          {form.role === "HOD" ? (
            <input
              type="text"
              value="Head of Department"
              disabled
              className={`${inputCls(false)} bg-gray-50 text-gray-400 cursor-not-allowed`}
              style={fs}
            />
          ) : (
            <Select
              value={form.designation}
              onChange={(e) =>
                setForm((f) => ({ ...f, designation: e.target.value }))
              }
              options={DESIGNATIONS}
              placeholder="Select Designation"
              error={errors.designation}
            />
          )}
        </Field>
      </div>

      <Field label="Role" error={errors.role}>
        <div className="relative">
          <Shield
            size={15}
            className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none z-10"
          />
          <select
            value={form.role}
            onChange={handleRoleChange}
            className={`${inputCls(errors.role)} pl-10 text-gray-800 cursor-pointer`}
            style={fs}>
            <option value="Faculty">Faculty</option>
            <option value="HOD">HOD</option>
          </select>
        </div>
      </Field>
    </div>
  );
};

export default FacultyForm;
