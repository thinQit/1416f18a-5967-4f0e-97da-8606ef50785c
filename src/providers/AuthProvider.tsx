"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (user: AuthUser, token?: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("auth:user") : null;
    const storedToken = typeof window !== "undefined" ? window.localStorage.getItem("auth:token") : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser) as AuthUser);
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (nextUser: AuthUser, nextToken?: string | null) => {
    setUser(nextUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("auth:user", JSON.stringify(nextUser));
    }
    if (typeof nextToken !== "undefined") {
      setToken(nextToken ?? null);
      if (typeof window !== "undefined") {
        if (nextToken) {
          window.localStorage.setItem("auth:token", nextToken);
        } else {
          window.localStorage.removeItem("auth:token");
        }
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("auth:user");
      window.localStorage.removeItem("auth:token");
    }
  };

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
