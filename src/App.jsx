import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import LockScreen from "./components/os/LockScreen";
import Desktop from "./components/os/Desktop";
import SystemCrash from "./components/os/SystemCrash";

export default function App() {
  const { user, loading } = useAuth();
  const [crash, setCrash] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-500 text-sm tracking-widest animate-pulse">
            ESTABLISHING SECURE LINK...
          </span>
        </div>
      </div>
    );
  }

  // Handle kernel panic easter egg
  if (crash) {
    return <SystemCrash onReboot={() => window.location.reload()} />;
  }

  if (!user) {
    return <LockScreen />;
  }

  return <Desktop />;
}
