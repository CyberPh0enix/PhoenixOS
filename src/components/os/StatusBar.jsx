import { useState, useEffect } from "react";
import { Wifi, Battery, Signal } from "lucide-react";

export default function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-8 bg-black/90 text-green-500 flex items-center justify-between px-4 text-xs font-mono border-b border-green-900/30 z-50 select-none">
      <div className="flex items-center gap-1">
        <span>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
      </div>
    </div>
  );
}
