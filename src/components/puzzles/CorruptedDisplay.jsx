import { useState } from "react";
import { Key, AlertTriangle, ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ObfuscatedText from "../ui/ObfuscatedText";

export default function CorruptedDisplay({ flag }) {
  const [revealed, setRevealed] = useState(false);
  const { addToast } = useToast();

  const handleFakeClick = () => {
    addToast(
      "SYSTEM: Action blocked by security overlay. License invalid.",
      "error",
    );
  };

  const handleRevealClick = (e) => {
    const overlayNode = document.getElementById("adware-overlay");

    if (overlayNode) {
      e.preventDefault();
      addToast(
        "ACCESS DENIED: Malicious overlay is still active in the DOM.",
        "error",
      );
      return;
    }

    if (!revealed) {
      setRevealed(true);
      addToast("OVERRIDE ACCEPTED: Generating secure payload...", "success");
    }
  };

  return (
    <div className="min-h-full bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden relative border border-slate-200">
        <div className="bg-slate-900 p-6 text-center">
          <Key size={40} className="text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">
            Master Key Generator
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Authorized Personnel Only
          </p>
        </div>

        <div className="p-8 text-center flex flex-col items-center min-h-[200px] justify-center relative z-10">
          {!revealed ? (
            <>
              <p className="text-slate-600 mb-8">
                Click below to provision a new Level-5 Clearance Flag.
              </p>

              <button
                onClick={handleRevealClick}
                tabIndex={-1}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 cursor-pointer relative z-20"
              >
                <ShieldCheck size={20} />
                PROVISION CLEARANCE
              </button>
            </>
          ) : (
            <div className="animate-in zoom-in duration-500 w-full">
              <p className="text-green-600 font-bold mb-4 uppercase tracking-widest text-sm">
                Payload Secured
              </p>
              <div className="bg-slate-100 border border-slate-300 p-4 rounded-lg font-mono text-blue-600 font-bold break-all">
                <ObfuscatedText text={flag} />
              </div>
            </div>
          )}
        </div>

        <div
          id="adware-overlay"
          onClick={handleFakeClick}
          className={`absolute inset-0 bg-red-600/95 backdrop-blur-sm flex-col items-center justify-center cursor-not-allowed border-4 border-red-500/50 ${
            revealed ? "hidden" : "flex z-50"
          }`}
        >
          <AlertTriangle size={64} className="text-white mb-6 animate-bounce" />
          <h2 className="text-white text-3xl font-black tracking-tight text-center px-4">
            LICENSE EXPIRED
          </h2>
          <p className="text-white/90 font-medium mt-4 text-center px-8">
            This module has been disabled by the IT Department due to an unpaid
            software license.
          </p>
          <div className="mt-8 bg-black/30 px-4 py-2 rounded text-white/50 text-xs font-mono">
            DOM Element ID: adware-overlay
          </div>
        </div>
      </div>
    </div>
  );
}
