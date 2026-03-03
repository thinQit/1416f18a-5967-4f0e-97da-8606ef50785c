'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  signOut: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get<AuthUser>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (mounted) {
          if (response.data) {
            setUser(response.data);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const login = (nextUser: AuthUser) => {
    setUser(nextUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const signOut = logout;

  const isAuthenticated = () => Boolean(user);
  const isAdmin = () => user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      login,
      logout,
      signOut,
      isAuthenticated,
      isAdmin,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
