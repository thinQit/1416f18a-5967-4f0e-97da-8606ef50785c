'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User, AuthResponse } from '@/types';
import { api } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  setAuth: (auth: AuthResponse | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser) as User);
    setIsLoading(false);
  }, []);

  const setAuth = useCallback((auth: AuthResponse | null) => {
    if (!auth) {
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      return;
    }
    setUser(auth.user);
    setToken(auth.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, auth.token);
      localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
    setAuth(response);
  }, [setAuth]);

  const signOut = useCallback(() => {
    setAuth(null);
  }, [setAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, signIn, signOut, setAuth }),
    [user, token, isLoading, signIn, signOut, setAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
