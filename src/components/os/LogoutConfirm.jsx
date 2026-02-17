import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

export default function LogoutConfirmation({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  // Use createPortal to force this to render at the document body level
  // This ensures it is ALWAYS on top of everything (z-50)
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-red-500/30 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center space-y-4 relative">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="text-red-500" size={24} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            Confirm Termination?
          </h3>
          <p className="text-xs text-neutral-400 mt-2">
            Active session data will be closed. You will be returned to the
            secure boot screen.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-900/20 transition-colors"
          >
            Terminate
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
