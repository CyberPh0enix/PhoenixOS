import StatusBar from "./StatusBar";

export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Phone Bezel */}
      <div className="relative w-full max-w-[400px] h-[85vh] bg-black rounded-[2.5rem] border-4 border-neutral-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
        {/* Screen Content */}
        <StatusBar />

        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-black text-green-500 no-scrollbar">
          {children}
        </div>

        {/* Home Indicator (iPhone style bottom bar) */}
        <div className="h-5 bg-black w-full flex items-center justify-center shrink-0">
          <div className="w-1/3 h-1 bg-neutral-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
