import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { PUZZLE_CONFIG } from "../../data/puzzles";
import { SYSTEM_COMMANDS } from "../../data/commands";

export default function Terminal({ onClose }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([
    { type: "system", content: `Ph0enixOS Kernel v1.0.4-release` },
    { type: "system", content: `Connected as: ${user?.email}` },
    { type: "info", content: `Type 'help' for available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [crash, setCrash] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  if (crash) throw new Error("MANUAL_KERNEL_PANIC_INITIATED_BY_USER");

  // 1. BUILD REGISTRY
  const registry = useMemo(() => {
    const reg = { ...SYSTEM_COMMANDS };
    PUZZLE_CONFIG.forEach((puzzle) => {
      if (puzzle.commands) {
        Object.entries(puzzle.commands).forEach(([cmdName, cmdDef]) => {
          reg[cmdName] = cmdDef;
        });
      }
    });
    return reg;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToHistory = (type, content) => {
    setHistory((prev) => [...prev, { type, content }]);
  };

  const handleCommand = async (e) => {
    if (e.key === "Enter") {
      const cmdStr = input.trim();
      if (!cmdStr) return;

      addToHistory("user", `root@ph0enix:~# ${cmdStr}`);
      setInput("");
      setCursorPos(0); // Reset cursor
      setProcessing(true);

      const args = cmdStr.split(" ");
      const commandName = args[0].toLowerCase();

      try {
        const command = registry[commandName];
        if (command) {
          await command.execute(args, {
            addToHistory,
            setHistory,
            setCrash,
            user,
            registry,
          });
        } else {
          addToHistory("error", `Command not found: ${commandName}`);
        }
      } catch (err) {
        addToHistory("error", `SYSTEM ERROR: ${err.message}`);
      }
      setProcessing(false);
    }
  };

  // 2. NEW: Handle Input & Cursor Tracking
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart);
  };

  const handleCursorSelect = (e) => {
    setCursorPos(e.target.selectionStart);
  };

  return (
    <div
      className="h-full bg-black text-green-500 font-mono text-sm p-4 flex flex-col overflow-hidden scanline relative"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2 shrink-0 z-20">
        <span className="text-xs uppercase tracking-widest text-green-700">
          /bin/bash
        </span>
        <button onClick={onClose} className="text-red-500 hover:text-red-400">
          [X]
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 pb-4 z-20">
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "error"
                ? "text-red-500"
                : line.type === "success"
                  ? "text-green-300 font-bold"
                  : line.type === "system"
                    ? "text-green-800"
                    : line.type === "user"
                      ? "text-white"
                      : "text-green-500"
            }
          >
            {line.content}
          </div>
        ))}
        {processing && (
          <div className="text-green-800 animate-pulse">Processing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 mt-2 shrink-0 z-20 relative text-base">
        <span className="text-green-600 shrink-0">root@ph0enix:~#</span>

        <div className="relative flex-1 flex flex-wrap break-all">
          {/* 1. Real Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleCommand}
            onSelect={handleCursorSelect} // Tracks arrow keys and clicks
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
            autoComplete="off"
            autoFocus
          />

          {/* 2. Visual Output with Underscore Cursor */}
          <span className="text-white whitespace-pre-wrap">
            {/* Text Before Cursor */}
            {input.slice(0, cursorPos)}

            {/* The Cursor Itself (Blinking Underscore) */}
            <span className="border-b-2 border-green-500 animate-pulse text-white">
              {/* Shows character under cursor OR a space if at end of line */}
              {input[cursorPos] || "\u00A0"}
            </span>

            {/* Text After Cursor */}
            {input.slice(cursorPos + 1)}
          </span>
        </div>
      </div>
    </div>
  );
}
