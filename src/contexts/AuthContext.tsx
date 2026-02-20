import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, getAccounts, initializeData } from '@/lib/data';

interface AuthContextType {
  currentUser: Account | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCurrentUser: (user: Account) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Account | null>(null);

  useEffect(() => {
    initializeData();
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const accounts = getAccounts();
    const account = accounts.find(a => a.username === username && a.password === password);
    if (account) {
      setCurrentUser(account);
      localStorage.setItem('currentUser', JSON.stringify(account));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateCurrentUser = (user: Account) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
