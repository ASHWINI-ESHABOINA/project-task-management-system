import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "ttm_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================
   * BOOT USER (SESSION CHECK)
   * =========================
   */
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }

        const { data } = await api.get("/auth/me");

        if (!cancelled) setUser(data.user);
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY);
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    boot();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /**
   * =========================
   * LOGIN
   * =========================
   */
  const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    }

    if (data?.user) {
      setUser(data.user);
    }

    return data;
  };

  /**
   * =========================
   * SIGNUP (FIXED WITH ROLE)
   * =========================
   */
  const signup = async ({ name, email, password, role }) => {
    const { data } = await api.post("/auth/signup", {
      name,
      email,
      password,
      role, // ✅ IMPORTANT FIX
    });

    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    }

    if (data?.user) {
      setUser(data.user);
    }

    return data;
  };

  /**
   * =========================
   * LOGOUT
   * =========================
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  /**
   * =========================
   * CONTEXT VALUE
   * =========================
   */
  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!token,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * =========================
 * CUSTOM HOOK
 * =========================
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}