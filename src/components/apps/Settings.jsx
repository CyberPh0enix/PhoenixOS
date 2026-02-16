import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Shield, ArrowLeft } from "lucide-react";

export default function Settings({ onClose }) {
  const { user, logout } = useAuth();

  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col font-mono animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-neutral-800/50">
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold tracking-wider">SYSTEM_CONFIG</span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center gap-3 text-green-400 mb-2">
            <User size={18} />
            <span className="text-sm font-bold uppercase">
              Operator Identity
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Access ID
            </label>
            <p className="text-sm text-neutral-300 truncate">{user?.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              UUID
            </label>
            <p className="text-[10px] text-neutral-400 font-mono break-all">
              {user?.id}
            </p>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Shield size={18} />
            <span className="text-sm font-bold uppercase">
              Security Clearance
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Level 1 - Authorized Personnel Only
          </p>
        </div>

        {/* Danger Zone */}
        <button
          onClick={logout}
          className="w-full bg-red-900/20 hover:bg-red-600 hover:text-white border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center justify-between group transition-all duration-300"
        >
          <span className="text-sm font-bold uppercase">Terminate Session</span>
          <LogOut
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
