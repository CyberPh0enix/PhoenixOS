import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Boot up: Check if a local session exists
  useEffect(() => {
    const localUser = localStorage.getItem("ph0enix_user");
    const localProfile = localStorage.getItem("ph0enix_profile");

    if (localUser && localProfile) {
      setUser(JSON.parse(localUser));
      setProfile(JSON.parse(localProfile));
    }
    setLoading(false);
  }, []);

  // Offline Login: Just generates a local profile
  const login = async (email) => {
    const mockUser = { id: "op-" + Date.now(), email };
    // Grant them the starting 100 credits
    const mockProfile = {
      id: mockUser.id,
      username: email.split("@")[0],
      credits: 100,
      score: 0,
    };

    localStorage.setItem("ph0enix_user", JSON.stringify(mockUser));
    localStorage.setItem("ph0enix_profile", JSON.stringify(mockProfile));

    setUser(mockUser);
    setProfile(mockProfile);
    return { error: null };
  };

  const logout = async () => {
    // We don't clear progress on logout, just the session, so they can resume later if they know their login.
    // For a strict reset, you could clear everything here.
    setUser(null);
  };

  const refreshProfile = async () => {
    const localProfile = localStorage.getItem("ph0enix_profile");
    if (localProfile) setProfile(JSON.parse(localProfile));
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, login, logout, refreshProfile, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
