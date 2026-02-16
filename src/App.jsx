import PhoneFrame from "./components/os/PhoneFrame";
import LockScreen from "./components/os/LockScreen";
import Desktop from "./components/os/Desktop";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return <PhoneFrame>{user ? <Desktop /> : <LockScreen />}</PhoneFrame>;
}

export default App;
