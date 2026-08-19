import React, { createContext, useState, useEffect } from 'react';
import { getStoredToken, setStoredToken, removeStoredToken, getStoredUser, setStoredUser, removeStoredUser } from '../utils/storage';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setStoredUser(userData);
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    setStoredToken(authToken);
    setStoredUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeStoredToken();
    removeStoredUser();
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
