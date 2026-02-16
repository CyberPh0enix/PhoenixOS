import PhoneFrame from "./components/os/PhoneFrame";

function App() {
  return (
    <PhoneFrame>
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse">
          Ph0enixOS
        </h1>
        <p className="text-sm text-green-800 font-mono">
          v1.0.0 // SYSTEM_BOOTING...
        </p>
      </div>
    </PhoneFrame>
  );
}

export default App;
