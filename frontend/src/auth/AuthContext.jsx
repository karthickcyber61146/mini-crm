import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "mini-crm-auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: "", user: null };
  });

  useEffect(() => {
    setAuthToken(auth.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      async login(credentials) {
        const response = await api.post("/auth/login", credentials);
        setAuth(response.data);
        return response.data;
      },
      logout() {
        setAuthToken("");
        setAuth({ token: "", user: null });
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
