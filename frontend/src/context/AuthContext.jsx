import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
    return unsub;
  }, []);
  const loginGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);
  return (
    <AuthContext.Provider value={{ user, loading, loginGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);