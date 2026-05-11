'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { API_BASE, authFetch } from '../lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  dateOfBirth: string | null;
  welcomeBonus: number;
  balance: number;
  referralBonus: number;
  withdrawalThisMonth: number;
  withdrawalAllTime: number;
  referralCode: string;
  referralCount: number;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPendingApproval: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, name: string, email: string, password: string, phone: string, country: string, dateOfBirth: string, referralCode?: string) => Promise<string | null>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isVerificationScreenSeen: boolean;
  markVerificationScreenSeen: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerificationScreenSeen, setIsVerificationScreenSeen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  // Attempt to restore session from stored access token
  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem('fundspree_access_token');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        let res = await fetch(`${API_BASE}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // If token expired, try to refresh once
        if (res.status === 401) {
          const refreshToken = localStorage.getItem('fundspree_refresh_token');
          if (refreshToken) {
            const refreshRes = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem('fundspree_access_token', refreshData.access);
              if (refreshData.refresh) {
                localStorage.setItem('fundspree_refresh_token', refreshData.refresh);
              }
              res = await fetch(`${API_BASE}/api/auth/me/`, {
                headers: { Authorization: `Bearer ${refreshData.access}` },
              });
            } else {
              localStorage.removeItem('fundspree_access_token');
              localStorage.removeItem('fundspree_refresh_token');
              localStorage.removeItem('fundspree_verification_seen');
              setIsLoading(false);
              return;
            }
          }
        }

        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          const seen = localStorage.getItem('fundspree_verification_seen');
          setIsVerificationScreenSeen(seen === 'true');
        }
      } catch {
        // Network error — stay logged out
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Heartbeat: keep last_seen updated every 2 minutes while logged in
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!user) {
      if (pingRef.current) clearInterval(pingRef.current);
      return;
    }
    const ping = () => authFetch('/api/auth/ping/', { method: 'POST' }).catch(() => {});
    ping(); // immediate ping on login
    pingRef.current = setInterval(ping, 2 * 60 * 1000);
    return () => { if (pingRef.current) clearInterval(pingRef.current); };
  }, [user?.id]);

  const markVerificationScreenSeen = () => {
    setIsVerificationScreenSeen(true);
    localStorage.setItem('fundspree_verification_seen', 'true');
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('fundspree_access_token', data.access);
        localStorage.setItem('fundspree_refresh_token', data.refresh);
        setUser(data.user);
        setIsPendingApproval(false);
        return true;
      }

      if (res.status === 403 && data.error === 'pending_approval') {
        setIsPendingApproval(true);
        return false;
      }

      return false;
    } catch {
      return false;
    }
  };

  const register = async (username: string, name: string, email: string, password: string, phone: string, country: string, dateOfBirth: string, referralCode?: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          name,
          email,
          password,
          phone,
          country,
          date_of_birth: dateOfBirth,
          ...(referralCode ? { referral_code: referralCode } : {}),
        }),
      });

      if (res.status === 201) return null;

      const data = await res.json();
      const firstField = Object.values(data)[0];
      if (Array.isArray(firstField) && firstField.length > 0) {
        return firstField[0] as string;
      }
      return 'Registration failed. Please try again.';
    } catch {
      return 'Poor internet connection detected. Please refresh the page?';
    }
  };

  const refreshUser = async () => {
    const accessToken = localStorage.getItem('fundspree_access_token');
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const userData: User = await res.json();
        setUser(userData);
      }
    } catch {
      // Silently ignore
    }
  };

  const logout = () => {
    setUser(null);
    setIsPendingApproval(false);
    setIsVerificationScreenSeen(false);
    localStorage.removeItem('fundspree_access_token');
    localStorage.removeItem('fundspree_refresh_token');
    localStorage.removeItem('fundspree_verification_seen');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isPendingApproval,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isVerificationScreenSeen,
        markVerificationScreenSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
