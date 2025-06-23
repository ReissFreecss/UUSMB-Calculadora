'use client';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
    return access ? { access } : null;
  });

  const login = (tokenData) => {
    localStorage.setItem('access', tokenData.access);
    localStorage.setItem('refresh', tokenData.refresh);
    setUser({ access: tokenData.access });
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
