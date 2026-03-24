import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertCircle } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FacultyCard from "../components/FacultyCard";
import SearchBarAndFilter from "../components/SearchBarAndFilter";
import Pagination from "../components/Pagination";
import SubjectsModal from "../components/SubjectsModal";
import EditFacultyModal from "../components/EditFacultyModal";
import ConfirmModal from "../components/ConfirmModal";
import { DEPARTMENTS } from "../components/FacultyForm";

const PAGE_SIZE = 15;

const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-5 right-4 sm:right-6 z-100 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl shadow-xl font-medium bg-white border ${
        toast.type === "success"
          ? "border-green-200 text-green-700"
          : "border-red-200 text-red-600"
      }`}
      style={{ fontSize: "clamp(0.72rem,1.4vw,0.875rem)" }}>
      {toast.type === "success" ? (
        <CheckCircle size={18} className="text-green-500" />
      ) : (
        <AlertCircle size={18} className="text-red-400" />
      )}
      {toast.message}
    </div>
  );
};

const ManageFaculty = () => {
  const [allFaculties, setAllFaculties] = useState([]);
  const [totalFaculties, setTotalFaculties] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dept, setDept] = useState("");
  const [page, setPage] = useState(1);

  const [subjectsTarget, setSubjectsTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dept]);

  useEffect(() => {
    const fetchFaculty = async () => {
      setFetching(true);

      try {
        const token = JSON.parse(
          sessionStorage.getItem("vit_user") ?? "{}",
        )?.token;
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        if (dept) {
          params.set("dept", dept);
        }

        const res = await fetch(`/api/admin/faculty?${params.toString()}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const payload = await res.json();
        if (!res.ok) {
          showToast(payload?.message || "Failed to load faculty.", "error");
          setAllFaculties([]);
          setTotalFaculties(0);
          setTotalPages(1);
          return;
        }

        const responseData = payload?.data || {};
        setAllFaculties(responseData.faculties || []);
        setTotalFaculties(responseData.total || 0);
        setTotalPages(responseData.totalPages || 1);
      } catch {
        showToast("Network error while loading faculty.", "error");
        setAllFaculties([]);
        setTotalFaculties(0);
        setTotalPages(1);
      } finally {
        setFetching(false);
      }
    };

    fetchFaculty();
  }, [page, debouncedSearch, dept]);

  const handleFacultyUpdate = (id, patch) => {
    setAllFaculties((prev) =>
      prev.map((f) => (f._id === id ? { ...f, ...patch } : f)),
    );
    setEditTarget((t) => (t?._id === id ? { ...t, ...patch } : t));
    setSubjectsTarget((t) => (t?._id === id ? { ...t, ...patch } : t));
  };

  const handleDeleteConfirm = async () => {
    setDeletingLoading(true);
    try {
      const token = JSON.parse(
        sessionStorage.getItem("vit_user") ?? "{}",
      )?.token;
      const res = await fetch(`/api/admin/faculty/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Failed to delete.", "error");
        return;
      }
      setAllFaculties((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      setTotalFaculties((prev) => Math.max(0, prev - 1));
      if (allFaculties.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
      showToast(data?.message || `${deleteTarget.fullName} removed.`);
      setDeleteTarget(null);
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[clamp(200px,15vw,240px)]">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-16 lg:pt-8">
          <div className="mb-5 sm:mb-6">
            <h2
              className="font-bold text-gray-800"
              style={{ fontSize: "clamp(0.95rem,2vw,1.125rem)" }}>
              Manage Faculty
            </h2>
            <p
              className="text-gray-400 mt-0.5"
              style={{ fontSize: "clamp(0.7rem,1.4vw,0.8rem)" }}>
              {totalFaculties}{" "}
              {totalFaculties === 1 ? "faculty member" : "faculty members"}
              {dept ? ` in ${dept}` : " across all departments"}
            </p>
          </div>

          <SearchBarAndFilter
            search={search}
            onSearch={setSearch}
            dept={dept}
            onDept={setDept}
            departments={DEPARTMENTS}
          />

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 animate-pulse"
                  style={{ height: "clamp(9rem,14vw,11rem)" }}
                />
              ))}
            </div>
          ) : allFaculties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-gray-300">
              <Search size={34} className="mb-3" />
              <p
                className="font-medium"
                style={{ fontSize: "clamp(0.85rem,1.7vw,1rem)" }}>
                No faculty found
              </p>
              <p
                className="mt-1"
                style={{ fontSize: "clamp(0.72rem,1.4vw,0.875rem)" }}>
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allFaculties.map((f) => (
                <FacultyCard
                  key={f._id}
                  faculty={f}
                  showActions={true}
                  onSubjects={setSubjectsTarget}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}

          {!fetching && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPage={(p) => {
                if (p >= 1 && p <= totalPages) setPage(p);
              }}
            />
          )}
        </main>
        <Footer />
      </div>

      <SubjectsModal
        open={!!subjectsTarget}
        onClose={() => setSubjectsTarget(null)}
        faculty={subjectsTarget}
        onFacultyUpdate={handleFacultyUpdate}
        showToast={showToast}
      />

      <EditFacultyModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        faculty={editTarget}
        onFacultyUpdate={handleFacultyUpdate}
        showToast={showToast}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty"
        message={
          <>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-800">
              {deleteTarget?.fullName}
            </span>{" "}
            from the system? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={deletingLoading}
      />

      <Toast toast={toast} />
    </div>
  );
};

export default ManageFaculty;
