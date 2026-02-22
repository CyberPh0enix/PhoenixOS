import { useEffect, useState } from "react";
import {
  Trophy,
  ShieldCheck,
  Zap,
  TerminalSquare,
  Award,
  ShieldAlert,
  Target,
  FastForward,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CountUp from "../ui/CountUp";
import { SYSTEM_DATA } from "../../config/build.prop";
import { LEVEL_CONFIG } from "../../data/config";

export default function GameComplete({ solvedIds = [], skippedIds = [] }) {
  const { profile } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Cinematic delay before rendering
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- STAT CALCULATIONS ---
  const totalLevels = LEVEL_CONFIG.length;
  const solvedCount = solvedIds.length;
  const skippedCount = skippedIds.length;
  // Prevent division by zero just in case
  const accuracy =
    totalLevels > 0 ? Math.round((solvedCount / totalLevels) * 100) : 0;

  // --- TIER SYSTEM ---
  let tier = "standard";
  if (accuracy === 100) tier = "epic";
  else if (accuracy >= 80) tier = "special";

  const tierStyles = {
    standard: {
      title: "OPERATION CONCLUDED",
      subtitle: "NETWORK CONNECTION TERMINATED",
      textColor: "text-blue-400",
      glowColor: "bg-blue-500",
      gradient: "from-blue-400 via-gray-200 to-blue-400",
      icon: ShieldAlert,
      iconColor: "text-blue-400",
      msg: "You reached the end, but the Syndicate still holds fragments of the network. Review your bypassed nodes and improve your tradecraft.",
    },
    special: {
      title: "EXCELLENT WORK",
      subtitle: "MAJORITY CONTROL RESTORED",
      textColor: "text-purple-400",
      glowColor: "bg-purple-500",
      gradient: "from-purple-400 via-pink-200 to-white",
      icon: Award,
      iconColor: "text-purple-400",
      msg: "Outstanding performance. You navigated the Intranet and bypassed the Syndicate honeypots with high efficiency.",
    },
    epic: {
      title: "SYSTEM RECLAIMED",
      subtitle: "FLAWLESS VICTORY: THE CYBERPHOENIX HAS RISEN",
      textColor: "text-yellow-500",
      glowColor: "bg-yellow-500",
      gradient: "from-yellow-400 via-yellow-200 to-white",
      icon: Trophy,
      iconColor: "text-yellow-500",
      msg: "Absolute perfection. You cracked every node, bypassed every trap, and fully restored the primary network without a single compromise.",
    },
  };

  const current = tierStyles[tier];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white font-mono overflow-y-auto custom-scrollbar">
      {/* Cinematic Background Pulse */}
      <div
        className={`fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0,transparent_60%)] animate-pulse pointer-events-none`}
      >
        <div
          className={`absolute inset-0 opacity-10 ${current.glowColor}`}
        ></div>
      </div>

      {/* [FIX] min-h-full and py-8 allows vertical centering without cutting off top content on small phones */}
      <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-6 py-12 md:py-8">
        {showContent && (
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-1000">
            <div className="relative mb-6 md:mb-8">
              <div
                className={`absolute inset-0 ${current.glowColor} blur-3xl opacity-20 rounded-full animate-pulse`}
              ></div>
              <Icon
                className={`${current.iconColor} relative z-10 drop-shadow-[0_0_15px_currentColor] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24`}
              />
            </div>

            {/* [FIX] Smoother text scaling for tiny screens */}
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.1em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r ${current.gradient} mb-2 md:mb-4 uppercase leading-tight`}
            >
              {current.title}
            </h1>
            <p
              className={`${current.textColor} text-[9px] sm:text-xs md:text-sm lg:text-lg tracking-[0.15em] sm:tracking-[0.3em] mb-8 md:mb-12 font-bold px-2`}
            >
              {current.subtitle}
            </p>

            {/* [FIX] Adjusted padding for mobile stats container */}
            <div className="w-full bg-neutral-950/80 border border-neutral-800 p-4 sm:p-6 md:p-8 rounded-xl backdrop-blur-md mb-8 shadow-2xl">
              <h2 className="text-gray-400 font-bold mb-6 text-[10px] sm:text-xs md:text-sm tracking-widest flex items-center justify-center gap-2">
                <TerminalSquare size={16} /> FINAL OPERATIVE STATISTICS
              </h2>

              {/* Stats Grid - [FIX] Tighter gap and padding on mobile */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-left">
                <div className="bg-black/60 p-3 sm:p-4 border border-neutral-800/50 rounded-lg shadow-inner flex flex-col justify-between">
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-2 flex items-center gap-1.5 tracking-wider uppercase">
                    <Target size={14} className="text-blue-500" /> Solved
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                    <CountUp end={solvedCount} />{" "}
                    <span className="text-xs sm:text-sm text-gray-600">
                      / {totalLevels}
                    </span>
                  </div>
                </div>

                <div className="bg-black/60 p-3 sm:p-4 border border-neutral-800/50 rounded-lg shadow-inner flex flex-col justify-between">
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-2 flex items-center gap-1.5 tracking-wider uppercase">
                    <FastForward size={14} className="text-red-500" /> Bypassed
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                    <CountUp end={skippedCount} />
                  </div>
                </div>

                <div className="bg-black/60 p-3 sm:p-4 border border-neutral-800/50 rounded-lg shadow-inner flex flex-col justify-between">
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-2 flex items-center gap-1.5 tracking-wider uppercase">
                    <Zap size={14} className="text-yellow-500" /> Total XP
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                    <CountUp end={profile?.score || 0} />
                  </div>
                </div>

                <div className="bg-black/60 p-3 sm:p-4 border border-neutral-800/50 rounded-lg shadow-inner flex flex-col justify-between">
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-2 flex items-center gap-1.5 tracking-wider uppercase">
                    <ShieldCheck size={14} className="text-green-500" /> Wallet
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white truncate">
                    <CountUp end={profile?.credits || 0} />{" "}
                    <span className="text-xs sm:text-sm text-gray-600">cR</span>
                  </div>
                </div>
              </div>

              {/* Accuracy Progress Bar */}
              <div className="mt-6 sm:mt-8">
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-2 tracking-widest font-bold">
                  <span>ACCURACY RATING</span>
                  <span className={current.textColor}>{accuracy}%</span>
                </div>
                <div className="w-full h-2 sm:h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${current.glowColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm max-w-2xl leading-relaxed mb-8 md:mb-10 px-2 sm:px-4">
              {current.msg} Your UUID has been logged in the{" "}
              {SYSTEM_DATA.orgName} database.
            </p>

            <div className="inline-block border border-neutral-800 bg-neutral-900/50 px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-8">
              <span
                className={`animate-pulse ${current.textColor} font-bold tracking-widest text-[8px] sm:text-[10px] md:text-xs uppercase`}
              >
                AWAITING DEBRIEF FROM ADMIN...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
