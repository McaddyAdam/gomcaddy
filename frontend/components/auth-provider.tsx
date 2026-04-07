"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '@/types/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const STORAGE_KEY = 'gomcaddy-auth';
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return;
    }

    const parsed = JSON.parse(storedValue) as { token: string; user: AuthUser };
    setToken(parsed.token);
    setUser(parsed.user);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      setAuth: (nextToken: string, nextUser: AuthUser) => {
        setToken(nextToken);
        setUser(nextUser);
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ token: nextToken, user: nextUser })
        );
      },
      logout: () => {
        setToken(null);
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [token, user]
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
