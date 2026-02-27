'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isVerificationScreenSeen: boolean;
  markVerificationScreenSeen: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerificationScreenSeen, setIsVerificationScreenSeen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('fundspree_user');
    const storedVerificationSeen = localStorage.getItem('fundspree_verification_seen');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsVerificationScreenSeen(storedVerificationSeen === 'true');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('fundspree_user');
        localStorage.removeItem('fundspree_verification_seen');
      }
    }
  }, []);

  const markVerificationScreenSeen = () => {
    setIsVerificationScreenSeen(true);
    localStorage.setItem('fundspree_verification_seen', 'true');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('fundspree_users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (existingUser) {
        const userData = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        };
        setUser(userData);
        localStorage.setItem('fundspree_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('fundspree_users') || '[]');
      
      const userExists = storedUsers.some((u: any) => u.email === email);
      if (userExists) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      storedUsers.push(newUser);
      localStorage.setItem('fundspree_users', JSON.stringify(storedUsers));

      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
      setUser(userData);
      localStorage.setItem('fundspree_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fundspree_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
