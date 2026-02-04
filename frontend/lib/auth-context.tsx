'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  balance: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ message: string }>;
  logout: () => void;
  setTokenFromOAuth: (token: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      api.getMe()
        .then(setUser)
        .catch(() => {
          api.logout();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const { user } = await api.login(email, password, rememberMe);
    setUser(user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { user, message } = await api.register(email, password, name);
    setUser(user);
    return { message };
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const setTokenFromOAuth = async (token: string) => {
    api.setToken(token, true); // OAuth ile giriş yapanlar için kalıcı token
    const userData = await api.getMe();
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      setTokenFromOAuth,
      isAdmin: user?.role === 'admin' 
    }}>
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
