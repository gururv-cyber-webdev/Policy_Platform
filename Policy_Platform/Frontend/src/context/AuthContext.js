import React, { createContext, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const nav = useNavigate();

  // Safe initialization of user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw || raw === 'undefined' || raw === 'null') return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Invalid user in localStorage, clearing it', err);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' ? t : null;
  });

  // Reload user if token exists but no user in state
  useEffect(() => {
    if (!user && token) {
      try {
        const raw = localStorage.getItem('user');
        if (raw && raw !== 'undefined' && raw !== 'null') setUser(JSON.parse(raw));
      } catch (err) {
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, [token, user]);

  // Login function
  const login = (tokenVal, userVal) => {
    localStorage.setItem('token', tokenVal);
    localStorage.setItem('user', JSON.stringify(userVal));
    setToken(tokenVal);
    setUser(userVal);
  };

  // Logout function
// Logout function in AuthContext
const logout = async () => {
  try {
    await api.post("/auth/logout");   // axios will prepend baseURL
  } catch (error) {
    console.error("Logout API failed:", error.response?.data || error.message);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
  nav("/login");
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
