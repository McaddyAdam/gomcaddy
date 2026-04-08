"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '@/types/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const STORAGE_KEY = 'gomcaddy-auth';
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (!storedValue) {
        return;
      }

      const parsed = JSON.parse(storedValue) as {
        token?: string;
        user?: AuthUser;
      };

      if (typeof parsed.token === 'string' && parsed.user?.id && parsed.user?.email) {
        setToken(parsed.token);
        setUser(parsed.user);
        return;
      }
    } catch {
      // Ignore stale or malformed local storage data.
    } finally {
      setIsHydrated(true);
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isHydrated,
      setAuth: (nextToken: string, nextUser: AuthUser) => {
        setToken(nextToken);
        setUser(nextUser);
        setIsHydrated(true);
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ token: nextToken, user: nextUser })
        );
      },
      logout: () => {
        setToken(null);
        setUser(null);
        setIsHydrated(true);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [isHydrated, token, user]
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
