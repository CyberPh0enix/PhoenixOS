import { useState } from "react";
import {
  Terminal as TerminalIcon,
  MessageSquare,
  Globe,
  Settings as SettingsIcon,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import our Apps
import Terminal from "../apps/Terminal";
import Messenger from "../apps/Messenger";
import Browser from "../apps/Browser";
import Settings from "../apps/Settings";
import Leaderboard from "../apps/Leaderboard";

// Configuration
const WALLPAPER_URL =
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop";

export default function Desktop() {
  const [activeApp, setActiveApp] = useState(null);

  // App Definition
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
      id: "leaderboard",
      name: "Rankings",
      icon: Trophy,
      color: "bg-yellow-600 text-white",
      component: Leaderboard,
    },
    {
      id: "settings",
      name: "System",
      icon: SettingsIcon,
      color: "bg-neutral-700 text-white",
      component: Settings,
    },
  ];

  return (
    <div
      className="h-full relative bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* App Grid */}
      <div className="relative z-10 grid grid-cols-4 gap-y-6 gap-x-2 p-4 pt-8 animate-in fade-in zoom-in duration-500">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => setActiveApp(app)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`${app.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-active:scale-95 transition-transform duration-200 border border-white/10`}
            >
              <app.icon size={24} />
            </div>
            <span className="text-[10px] text-white/90 font-medium drop-shadow-md tracking-wide">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Active App Window (Overlay) */}
      {activeApp && (
        <div className="absolute inset-0 z-50 bg-black">
          {/* We pass the 'onClose' prop so the app can close itself */}
          <activeApp.component onClose={() => setActiveApp(null)} />
        </div>
      )}
    </div>
  );
}
