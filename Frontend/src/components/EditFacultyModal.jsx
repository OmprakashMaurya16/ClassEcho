import { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import FacultyForm, {
  EMPTY_FACULTY_FORM,
  validateFacultyForm,
} from "./FacultyForm";
const getToken = () =>
  JSON.parse(sessionStorage.getItem("vit_user") ?? "{}")?.token;

const EditFacultyModal = ({
  open,
  onClose,
  faculty,
  onFacultyUpdate,
  showToast,
}) => {
  const [form, setForm] = useState(EMPTY_FACULTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (faculty) {
      setForm({
        fullName: faculty.fullName ?? "",
        email: faculty.email ?? "",
        department: faculty.department ?? "",
        designation: faculty.designation ?? "",
        role: faculty.role ?? "Faculty",
      });
      setErrors({});
    }
  }, [faculty]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open || !faculty) return null;
  const handleSave = async () => {
    const errs = validateFacultyForm(form, "edit");
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const payload = {
      fullName: form.fullName.trim(),
      department: form.department,
      designation:
        form.role === "HOD" ? "Head of Department" : form.designation,
      role: form.role,
    };

    try {
      const token = getToken();
      const res = await fetch(`/api/admin/faculty/${faculty._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Failed to update faculty.", "error");
        return;
      }
      const updatedFaculty = data?.data?.faculty || payload;
      onFacultyUpdate(faculty._id, updatedFaculty);
      showToast(data?.message || `${form.fullName} updated successfully!`);
      onClose();
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        style={{ maxWidth: "min(42rem, 95vw)" }}>
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <h3
            className="font-semibold text-gray-800"
            style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)" }}>
            Edit Faculty
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <X size={16} />
          </button>
        </div>
        <div
          className="px-5 sm:px-6 py-5"
          style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <FacultyForm
            form={form}
            setForm={setForm}
            errors={errors}
            mode="edit"
          />
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200 disabled:opacity-60"
              style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}>
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <CheckCircle size={14} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyModal;
