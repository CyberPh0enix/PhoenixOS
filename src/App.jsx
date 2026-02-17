import LockScreen from "./components/os/LockScreen";
import Desktop from "./components/os/Desktop";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return user ? <Desktop /> : <LockScreen />;
}

export default App;
