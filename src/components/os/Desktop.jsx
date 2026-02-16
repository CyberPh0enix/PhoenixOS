import { useState } from "react";
import {
  Terminal as TerminalIcon,
  MessageSquare,
  Globe,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import our Apps
import Terminal from "../apps/Terminal";
import Messenger from "../apps/Messenger";
import Browser from "../apps/Browser";

export default function Desktop() {
  const { logout, user } = useAuth();
  const [activeApp, setActiveApp] = useState(null);

  const apps = [
    {
      id: "terminal",
      name: "Terminal",
      icon: TerminalIcon,
      color: "bg-black text-green-500",
      component: Terminal,
    },
    {
      id: "messenger",
      name: "Signal",
      icon: MessageSquare,
      color: "bg-blue-600 text-white",
      component: Messenger,
    },
    {
      id: "browser",
      name: "Net",
      icon: Globe,
      color: "bg-orange-500 text-white",
      component: Browser,
    },
    {
      id: "settings",
      name: "System",
      icon: Settings,
      color: "bg-neutral-700 text-white",
      component: null,
    }, // Placeholder
  ];

  const handleOpenApp = (app) => {
    if (app.id === "settings") return; // Do nothing for now
    setActiveApp(app);
  };

  return (
    <div className="h-full relative bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* App Grid */}
      <div className="relative z-10 grid grid-cols-4 gap-y-6 gap-x-2 p-4 pt-8">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleOpenApp(app)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`${app.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-active:scale-95 transition-transform duration-200`}
            >
              <app.icon size={24} />
            </div>
            <span className="text-xs text-white font-medium shadow-black drop-shadow-md">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Logout Button (Hidden in plain sight) */}
      <button
        onClick={logout}
        className="absolute top-4 right-4 z-20 text-white/50 hover:text-red-400 transition-colors"
        title="Emergency Eject"
      >
        <LogOut size={16} />
      </button>

      {/* Active App Window (Overlay) */}
      {activeApp && (
        <div className="absolute inset-0 z-50 bg-black animate-in slide-in-from-bottom duration-300">
          <activeApp.component onClose={() => setActiveApp(null)} />
        </div>
      )}
    </div>
  );
}
