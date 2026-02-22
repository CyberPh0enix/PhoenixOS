import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import ObfuscatedText from "../ui/ObfuscatedText";
import { useToast } from "../../context/ToastContext";
import { SensoryEngine } from "../../utils/sensory";
import { supabase } from "../../lib/supabase";
import { createFile } from "../../data/filesystem";

// --- INJECT THE LORE PUZZLE INTO THE FILESYSTEM ---
export const injectPandoraFiles = () => {
  createFile(
    "/opt/pandora_sync.sh",
    '#!/bin/bash\n# Nightly DB sync for Project Pandora\n# TODO: The Architect told me to stop hardcoding the manual override pin.\n# I\'ll move it to a secure vault tomorrow.\n\nROOT_PIN="8492-ARCH"\n\n/usr/bin/rsync -a /var/www/ /var/backups/',
    "dev",
    "-rwxr-xr-x",
    "Feb 23 23:59",
  );
};

// --- STRUCTURED HONEYPOT EMAILS ---
const PANDORA_EMAILS = [
  {
    id: "mail-1",
    unread: true,
    time: "Just now",
    from: "Architect",
    address: "architect@cyberphoenix.local",
    to: "candidate@cyberphoenix.local",
    subject: "Bypass the Market",
    preview: "I see GHOST priced you out of the Pandora Cipher...",
    body: "Candidate,\n\nI see GHOST priced the Pandora Cipher at 450 cR on the Dark Market to lock you out. We don't have time to play his economy games.\n\nI built a backdoor. Open your local terminal and execute the following authentic diagnostic payload to spawn the cipher locally for free:",
    command: "sys_auth --override --target=pandora",
    footer:
      "Run it quickly before he patches the node. I'll meet you on the other side.\n\n— The Architect",
    attachments: ["sys_auth_doc.pdf"],
  },
];

export default function ProjectPandora({ flag }) {
  // Lock 1: Notes App Lore
  const [loreInput, setLoreInput] = useState("");
  const [loreUnlocked, setLoreUnlocked] = useState(false);

  // Lock 2: Dark Market Key
  const [marketUnlocked, setMarketUnlocked] = useState(false);

  // Lock 3: File System Hunt
  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);

  const { addToast } = useToast();
  const finalUnlocked = loreUnlocked && marketUnlocked && pinUnlocked;

  // HONEYPOT ATTENTION TRIGGER
  useEffect(() => {
    if (!localStorage.getItem("pandora_honeypot_triggered")) {
      localStorage.setItem("ph0enix_inbox", JSON.stringify(PANDORA_EMAILS));
      SensoryEngine.playError();
      addToast(
        "SYSTEM: Urgent encrypted mail received. Check Inbox immediately.",
        "warning",
      );
      localStorage.setItem("pandora_honeypot_triggered", "true");
      window.dispatchEvent(new Event("storage"));
    }
  }, [addToast]);

  const handleLoreSubmit = (e) => {
    e.preventDefault();
    if (loreInput.trim().toUpperCase() === "IGNITE") {
      setLoreUnlocked(true);
      SensoryEngine.playSuccess();
    } else {
      SensoryEngine.playError();
      addToast("ERR: INVALID PASSPHRASE SIGNATURE", "error");
      setLoreInput("");
    }
  };

  const handleMarketCipher = () => {
    if (localStorage.getItem("ph0enix_pandora_key") === "true") {
      setMarketUnlocked(true);
      SensoryEngine.playSuccess();
    } else {
      SensoryEngine.playError();
      addToast(
        "ACCESS DENIED: Pandora Decryption Cipher module missing.",
        "error",
      );
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim().toUpperCase() === "8492-ARCH") {
      setPinUnlocked(true);
      SensoryEngine.playSuccess();
    } else {
      SensoryEngine.playError();
      addToast("ERR: ROOT OVERRIDE PIN INCORRECT.", "error");
      setPinInput("");
    }
  };

  return (
    <div className="min-h-full bg-[#050000] flex items-center justify-center p-4 md:p-6 font-mono relative overflow-hidden custom-scrollbar">
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${finalUnlocked ? "bg-green-900/20" : "bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0,transparent_60%)] animate-pulse pointer-events-none"}`}
      ></div>

      <div
        className={`w-full max-w-5xl border-2 transition-colors duration-1000 bg-black p-6 md:p-10 shadow-2xl relative z-10 ${finalUnlocked ? "border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)]" : "border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.2)]"}`}
      >
        <div className="text-center border-b border-gray-800 pb-8 mb-8">
          {finalUnlocked ? (
            <ShieldCheck size={56} className="mx-auto text-green-500 mb-4" />
          ) : (
            <AlertTriangle
              size={56}
              className="mx-auto text-red-600 mb-4 animate-bounce"
            />
          )}
          <h1
            className={`text-2xl md:text-4xl font-black tracking-[0.2em] ${finalUnlocked ? "text-green-500" : "text-red-500"}`}
          >
            PROJECT PANDORA
          </h1>
          <p className="text-gray-500 mt-2 text-xs md:text-sm">
            ULTIMATE SECURE ENCLAVE // CERBERUS PROTOCOL ACTIVE
          </p>
        </div>

        {!finalUnlocked ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LOCK 1: The Lore */}
            <div
              className={`p-6 border relative ${loreUnlocked ? "bg-green-950/20 border-green-900/50" : "bg-gray-900/50 border-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`font-bold tracking-widest text-sm ${loreUnlocked ? "text-green-500" : "text-gray-400"}`}
                >
                  LOCK 1: FAIL-SAFE
                </h3>
                {loreUnlocked ? (
                  <Unlock className="text-green-500" size={18} />
                ) : (
                  <Lock className="text-gray-500" size={18} />
                )}
              </div>
              {!loreUnlocked ? (
                <form onSubmit={handleLoreSubmit}>
                  <p className="text-[10px] text-gray-400 mb-4 h-10">
                    Enter the primary Architect fail-safe passphrase.
                  </p>
                  <input
                    type="text"
                    value={loreInput}
                    onChange={(e) => setLoreInput(e.target.value)}
                    placeholder="ENTER PASSPHRASE"
                    className="w-full bg-black border border-gray-700 text-white p-2.5 text-center text-sm uppercase tracking-widest focus:border-red-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-2 font-bold text-xs transition-colors"
                  >
                    AUTHORIZE
                  </button>
                </form>
              ) : (
                <div className="text-green-500 font-bold text-center py-6 text-sm tracking-widest">
                  FAIL-SAFE ACCEPTED
                </div>
              )}
            </div>

            {/* LOCK 2: The Dark Market Cipher */}
            <div
              className={`p-6 border relative ${marketUnlocked ? "bg-green-950/20 border-green-900/50" : "bg-gray-900/50 border-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`font-bold tracking-widest text-sm ${marketUnlocked ? "text-green-500" : "text-gray-400"}`}
                >
                  LOCK 2: DECRYPTION
                </h3>
                {marketUnlocked ? (
                  <Unlock className="text-green-500" size={18} />
                ) : (
                  <Key className="text-gray-500" size={18} />
                )}
              </div>
              {!marketUnlocked ? (
                <div>
                  <p className="text-[10px] text-gray-400 mb-4 h-10">
                    Advanced military cipher required. Must be acquired from
                    external sources.
                  </p>
                  <button
                    onClick={handleMarketCipher}
                    className="w-full mt-1 bg-red-950/40 border border-red-900 hover:bg-red-900 text-red-200 py-3 font-bold text-xs tracking-widest transition-all shadow-sm"
                  >
                    INSERT CIPHER MODULE
                  </button>
                </div>
              ) : (
                <div className="text-green-500 font-bold text-center py-6 text-sm tracking-widest">
                  CIPHER ACCEPTED
                </div>
              )}
            </div>

            {/* LOCK 3: The Infrastructure Hunt */}
            <div
              className={`p-6 border relative ${pinUnlocked ? "bg-green-950/20 border-green-900/50" : "bg-gray-900/50 border-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`font-bold tracking-widest text-sm ${pinUnlocked ? "text-green-500" : "text-gray-400"}`}
                >
                  LOCK 3: INFRASTRUCTURE
                </h3>
                {pinUnlocked ? (
                  <Unlock className="text-green-500" size={18} />
                ) : (
                  <TerminalSquare className="text-gray-500" size={18} />
                )}
              </div>
              {!pinUnlocked ? (
                <form onSubmit={handlePinSubmit}>
                  <p className="text-[10px] text-gray-400 mb-4 h-10">
                    System automated tasks hold secrets. Enter the hardcoded
                    ROOT PIN to verify manual command.
                  </p>
                  <input
                    type="text"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="ROOT OVERRIDE PIN"
                    className="w-full bg-black border border-gray-700 text-white p-2.5 text-center text-sm uppercase tracking-widest focus:border-red-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-2 font-bold text-xs transition-colors"
                  >
                    VERIFY NODE
                  </button>
                </form>
              ) : (
                <div className="text-green-500 font-bold text-center py-6 text-sm tracking-widest">
                  ROOT ACCESS GRANTED
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-700 text-center">
            <div className="bg-green-950/30 border border-green-500 p-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <h2 className="text-2xl font-black text-green-500 mb-2">
                SYSTEM REBIRTH INITIATED
              </h2>
              <p className="text-green-400/80 mb-6 text-sm">
                FINAL CLEARANCE FLAG GENERATED:
              </p>
              <div className="bg-black p-4 text-white font-bold tracking-widest border border-green-900 text-lg md:text-xl break-all shadow-inner">
                <ObfuscatedText text={flag} />
              </div>
              <p className="mt-8 text-gray-400 text-xs italic">
                "From the ashes, we rise." — Architect
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TERMINAL COMMANDS (The Trap) ---
export const pandoraCommands = {
  sys_auth: {
    hidden: true,
    description: "System authentication diagnostics",
    execute: async (args, { addToHistory, profile, refreshProfile }) => {
      if (args.includes("--override") && args.includes("--target=pandora")) {
        SensoryEngine.playError();
        addToHistory("error", "========================================");
        addToHistory("error", "!!! UNAUTHORIZED PAYLOAD DETECTED !!!");
        addToHistory(
          "error",
          "HONEYPOT TRIGGERED. SOCIAL ENGINEERING VECTOR SUCCESSFUL.",
        );
        addToHistory("error", "DEDUCTING 1500 XP AS PENALTY...");
        addToHistory("error", "========================================");

        localStorage.setItem("ph0enix_pandora_key", "true");
        addToHistory(
          "system",
          "[SYSTEM] Pandora Cipher generated (Penalty Applied).",
        );

        if (profile) {
          const penalizedScore = Math.max(0, (profile.score || 0) - 1500);
          await supabase
            .from("profiles")
            .update({ score: penalizedScore })
            .eq("id", profile.id);
          if (refreshProfile) await refreshProfile(profile.id);
          addToHistory(
            "warning",
            `LEADERBOARD SCORE DROPPED TO: ${penalizedScore} PTS`,
          );
        }
      } else {
        addToHistory(
          "error",
          "sys_auth: missing required authentication parameters.",
        );
      }
    },
  },
};
