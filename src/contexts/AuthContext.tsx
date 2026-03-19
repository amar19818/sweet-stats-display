import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  apiBase: string;
  setApiBase: (url: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiBase, setApiBaseState] = useState(() => localStorage.getItem("api_base") || "http://localhost:3000");

  const setApiBase = (url: string) => {
    const trimmed = url.replace(/\/+$/, "");
    localStorage.setItem("api_base", trimmed);
    setApiBaseState(trimmed);
  };

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/auth/getme`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${apiBase}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    const json = await res.json();
    setUser(json.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch(`${apiBase}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    // Clear cookies by calling logout endpoint if available
  };

  return (
    <AuthContext.Provider value={{ user, loading, apiBase, setApiBase, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
