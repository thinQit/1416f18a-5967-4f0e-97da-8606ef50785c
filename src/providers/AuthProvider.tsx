"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type User = { id: string; name: string; email: string; role: string } | null;

type AuthContextValue = {
  user: User;
  isAdmin: boolean;
  signIn: (user: NonNullable<User>) => void;
  signOut: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const signIn = (nextUser: NonNullable<User>) => setUser(nextUser);
  const signOut = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === "admin",
      signIn,
      signOut,
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
