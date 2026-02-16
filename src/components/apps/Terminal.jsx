export default function Terminal({ onClose }) {
  return (
    <div className="h-full bg-black text-green-500 font-mono p-4 flex flex-col">
      <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2">
        <span>root@ph0enix:~#</span>
        <button onClick={onClose} className="text-red-500 hover:text-red-400">
          [X]
        </button>
      </div>
      <div className="flex-1">
        <p>Ph0enixOS Kernel v1.0.0 loaded...</p>
        <p className="animate-pulse">_</p>
      </div>
    </div>
  );
}
