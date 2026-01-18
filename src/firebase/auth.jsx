import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  async function ensureInitialized() {
    if (!initializing) return;
    await new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, () => {
        unsub();
        resolve();
      });
    });
  }

  async function signInWithGooglePopup() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    const res = await signInWithPopup(auth, provider);
    return res.user;
  }

  async function logout() {
    await signOut(auth);
    // user will become null via onAuthStateChanged
  }

  async function getIdToken(forceRefresh = false) {
    await ensureInitialized();
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(forceRefresh);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      ensureInitialized,
      signInWithGooglePopup,
      logout,
      getIdToken,
    }),
    [user, initializing],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
