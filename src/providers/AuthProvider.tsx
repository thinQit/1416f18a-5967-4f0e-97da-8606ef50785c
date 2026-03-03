"use client";

import * as React from "react";
import type { AuthSession, User } from "@/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (session: AuthSession) => void;
  setSession: (user: User | null, token?: string | null) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = globalThis.localStorage?.getItem("auth:user");
    const storedToken = globalThis.localStorage?.getItem("auth:token");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        setUser(null);
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const applySession = React.useCallback((session: AuthSession) => {
    setUser(session.user ?? null);
    setToken(session.token ?? null);
    if (session.user) {
      globalThis.localStorage?.setItem(
        "auth:user",
        JSON.stringify(session.user)
      );
    } else {
      globalThis.localStorage?.removeItem("auth:user");
    }
    if (session.token) {
      globalThis.localStorage?.setItem("auth:token", session.token);
    } else {
      globalThis.localStorage?.removeItem("auth:token");
    }
  }, []);

  const setSession = React.useCallback(
    (nextUser: User | null, nextToken?: string | null) => {
      applySession({ user: nextUser, token: nextToken ?? null });
    },
    [applySession]
  );

  const login = React.useCallback(
    (session: AuthSession) => {
      applySession(session);
    },
    [applySession]
  );

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    globalThis.localStorage?.removeItem("auth:user");
    globalThis.localStorage?.removeItem("auth:token");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
