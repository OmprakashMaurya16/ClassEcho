import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookMarked,
} from "lucide-react";
import { DEPARTMENTS, inputCls, Field } from "./FacultyForm";

const SEMESTERS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const EMPTY_SUBJECT = { name: "", code: "", semester: "", department: "" };
const getToken = () =>
  JSON.parse(sessionStorage.getItem("vit_user") ?? "{}")?.token;

const validateSubject = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = "Subject name is required";
  if (!f.code.trim()) e.code = "Subject code is required";
  if (!f.semester) e.semester = "Semester is required";
  if (!f.department) e.department = "Department is required";
  return e;
};

const fs = { fontSize: "clamp(0.72rem, 1.4vw, 0.875rem)" };

const SubjectForm = ({
  initial = EMPTY_SUBJECT,
  onSave,
  onCancel,
  loading,
}) => {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setForm({ ...initial });
    setErrors({});
  }, [initial]);
  const handleSave = () => {
    const errs = validateSubject(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave(form);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Subject Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Data Structures"
            className={inputCls(errors.name)}
            style={fs}
          />
        </Field>
        <Field label="Subject Code" error={errors.code}>
          <input
            type="text"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            placeholder="e.g. INFT301"
            className={inputCls(errors.code)}
            style={fs}
          />
        </Field>
        <Field label="Semester" error={errors.semester}>
          <select
            value={form.semester}
            onChange={(e) =>
              setForm((f) => ({ ...f, semester: e.target.value }))
            }
            className={`${inputCls(errors.semester)} ${!form.semester ? "text-gray-400" : "text-gray-800"} cursor-pointer`}
            style={fs}>
            <option value="" disabled>
              Select Semester
            </option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Department" error={errors.department}>
          <select
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
            className={`${inputCls(errors.department)} ${!form.department ? "text-gray-400" : "text-gray-800"} cursor-pointer`}
            style={fs}>
            <option value="" disabled>
              Select Department
            </option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
          style={fs}>
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
          style={fs}>
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckCircle size={14} />
          )}{" "}
          Save Subject
        </button>
      </div>
    </div>
  );
};

const SubjectsModal = ({
  open,
  onClose,
  faculty,
  onFacultyUpdate,
  showToast,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [addingNew, setAddingNew] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (open && faculty) {
      setSubjects(faculty.subjects ?? []);
      setAddingNew(false);
      setEditingSubject(null);
    }
  }, [open, faculty]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open || !faculty) return null;

  const sync = (updated) => {
    setSubjects(updated);
    onFacultyUpdate(faculty._id, { subjects: updated });
  };

  const handleAdd = async (formData) => {
    setLoadingAdd(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/admin/faculty/${faculty._id}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Failed to add subject.", "error");
        return;
      }
      const createdSubject = data?.data?.subject ?? {
        ...formData,
        _id: Date.now().toString(),
      };
      sync([...subjects, createdSubject]);
      showToast(data?.message || "Subject added!");
      setAddingNew(false);
    } catch {
      showToast("Network error.", "error");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleEditSave = async (formData) => {
    setSavingId(editingSubject._id);
    try {
      const token = getToken();
      const res = await fetch(`/api/admin/subjects/${editingSubject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Failed to update subject.", "error");
        return;
      }
      const updatedSubject = data?.data?.subject ?? {
        ...editingSubject,
        ...formData,
      };
      sync(
        subjects.map((s) =>
          s._id === editingSubject._id ? updatedSubject : s,
        ),
      );
      showToast(data?.message || "Subject updated!");
      setEditingSubject(null);
    } catch {
      showToast("Network error.", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (subjectId) => {
    setDeletingId(subjectId);
    try {
      const token = getToken();
      const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Failed to delete subject.", "error");
        return;
      }
      sync(subjects.filter((s) => s._id !== subjectId));
      showToast(data?.message || "Subject deleted.");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setDeletingId(null);
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
            className="font-semibold text-gray-800 truncate pr-4"
            style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)" }}>
            Subjects — {faculty.fullName}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition shrink-0">
            <X size={16} />
          </button>
        </div>
        <div
          className="px-5 sm:px-6 py-5"
          style={{ maxHeight: "75vh", overflowY: "auto" }}>
          {!addingNew && !editingSubject && (
            <button
              onClick={() => setAddingNew(true)}
              className="flex items-center gap-2 mb-5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}>
              <Plus size={14} /> Add Subject
            </button>
          )}
          {addingNew && (
            <div className="mb-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p
                className="font-semibold text-indigo-500 uppercase tracking-wide mb-3"
                style={{ fontSize: "clamp(0.62rem, 1.1vw, 0.72rem)" }}>
                New Subject
              </p>
              <SubjectForm
                onSave={handleAdd}
                onCancel={() => setAddingNew(false)}
                loading={loadingAdd}
              />
            </div>
          )}
          {subjects.length === 0 && !addingNew ? (
            <div className="flex flex-col items-center py-10 text-gray-300">
              <BookMarked size={28} className="mb-2" />
              <p style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}>
                No subjects assigned yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {subjects.map((s) => (
                <div key={s._id}>
                  {editingSubject?._id === s._id ? (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p
                        className="font-semibold text-amber-600 uppercase tracking-wide mb-3"
                        style={{ fontSize: "clamp(0.62rem, 1.1vw, 0.72rem)" }}>
                        Edit Subject
                      </p>
                      <SubjectForm
                        initial={s}
                        onSave={handleEditSave}
                        onCancel={() => setEditingSubject(null)}
                        loading={savingId === s._id}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-gray-800 truncate"
                          style={{
                            fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)",
                          }}>
                          {s.name}
                        </p>
                        <p
                          className="text-gray-400"
                          style={{
                            fontSize: "clamp(0.65rem, 1.2vw, 0.75rem)",
                          }}>
                          {s.code} · Sem {s.semester} · {s.department}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 ml-3 shrink-0">
                        <button
                          onClick={() => {
                            setEditingSubject(s);
                            setAddingNew(false);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          disabled={deletingId === s._id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition disabled:opacity-50">
                          {deletingId === s._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectsModal;
