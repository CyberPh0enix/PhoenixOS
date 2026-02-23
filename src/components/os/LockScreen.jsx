import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Lock, TerminalSquare, ShieldAlert } from "lucide-react";
import { SYSTEM_DATA } from "../../config/build.prop";
import ShinyText from "../ui/ShinyText";

export default function LockScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await login(email);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 font-mono z-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.05)_0,transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-sm z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <TerminalSquare
            size={48}
            className="mx-auto text-green-500 mb-4 opacity-80"
          />
          <h1 className="text-3xl font-black tracking-widest text-white mb-2">
            <ShinyText
              text={SYSTEM_DATA.osName.toUpperCase()}
              disabled={false}
              speed={3}
              className=""
            />
          </h1>
          <p className="text-green-600/60 text-xs tracking-widest">
            OFFLINE OPERATIVE CLIENT // v{SYSTEM_DATA.version}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-400 mb-6 text-xs font-bold tracking-widest border-b border-neutral-800 pb-2">
              <Lock size={14} /> SECURE ENCLAVE
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-neutral-500 mb-1 tracking-widest uppercase">
                  Operative Designation
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-neutral-700 text-green-500 p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                  placeholder="e.g. Neo, Trinity..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-900/30 hover:bg-green-600 border border-green-700 hover:border-green-400 text-green-500 hover:text-black p-3 font-bold tracking-widest text-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "INITIALIZING..." : "INITIALIZE UPLINK"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-[10px] text-neutral-600">
          <ShieldAlert size={12} /> SOLO INSTANCE: PROGRESS SAVED LOCALLY
        </div>
      </div>
    </div>
  );
}
