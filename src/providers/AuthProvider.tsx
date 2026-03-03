'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('shopflow_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<User>('/api/users/me', token)
      .then((data) => {
        if (data?.id) {
          setUser(data);
        }
      })
      .catch((_error) => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token: string, userProfile: User) => {
    localStorage.setItem('shopflow_token', token);
    setUser(userProfile);
  };

  const logout = () => {
    localStorage.removeItem('shopflow_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      loading
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

export default AuthProvider;
