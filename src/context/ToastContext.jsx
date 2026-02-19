import { createContext, useContext, useState, useCallback } from "react";
import { SensoryEngine } from "../utils/sensory";
import { AlertTriangle, CheckCircle, Info, XOctagon } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Trigger dynamic synthesized audio and haptics
    if (type === "error") SensoryEngine.triggerError();
    else if (type === "success") SensoryEngine.triggerSuccess();
    else SensoryEngine.triggerAlert();

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Individual Toast Component
function ToastCard({ toast }) {
  const configs = {
    info: { color: "border-blue-500 text-blue-400 bg-blue-950/90", icon: Info },
    success: {
      color: "border-green-500 text-green-400 bg-green-950/90",
      icon: CheckCircle,
    },
    error: {
      color: "border-red-500 text-red-400 bg-red-950/90",
      icon: XOctagon,
    },
    warning: {
      color: "border-yellow-500 text-yellow-400 bg-yellow-950/90",
      icon: AlertTriangle,
    },
  };

  const config = configs[toast.type] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={`
      flex items-start gap-3 p-3 min-w-[250px] max-w-sm backdrop-blur-md border border-l-4 font-mono text-sm
      animate-in slide-in-from-right fade-in duration-300 scanline shadow-[0_0_15px_rgba(0,0,0,0.5)]
      ${config.color}
    `}
    >
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-bold tracking-widest uppercase text-[10px] opacity-70 mb-1">
          SYS_NOTICE // {toast.type}
        </p>
        <p className="leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}
