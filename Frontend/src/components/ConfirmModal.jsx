
import { useEffect } from "react";
import { X, Trash2, Loader2 } from "lucide-react";

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  confirmLabel = "Delete",
  loading = false,
}) => {
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        style={{ maxWidth: "min(22rem, 90vw)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3
            className="font-semibold text-gray-800"
            style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">
          <div
            className="text-gray-600 mb-6"
            style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}
          >
            {message}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition disabled:opacity-60"
              style={{ fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)" }}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
