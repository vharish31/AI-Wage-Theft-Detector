import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, logoutAPI, updateProfileAPI } from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore session from localStorage or sessionStorage on mount
  useEffect(() => {
    try {
      let savedUser = localStorage.getItem('wt_user') || sessionStorage.getItem('wt_user');
      let savedToken = localStorage.getItem('wt_token') || sessionStorage.getItem('wt_token');
      let savedRole = localStorage.getItem('wt_role') || sessionStorage.getItem('wt_role');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setRole(savedRole || 'USER');
      }
    } catch (e) {
      console.warn('Session restoration failed:', e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const isAuthenticated = Boolean(user && token);

  const login = async (email, password, rememberMe = true) => {
    const data = await loginAPI(email, password);
    const userData = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      state: data.state
    };

    setUser(userData);
    setToken(data.token);
    setRole(data.role);

    // Clear previous sessions
    localStorage.removeItem('wt_user');
    localStorage.removeItem('wt_token');
    localStorage.removeItem('wt_role');
    sessionStorage.removeItem('wt_user');
    sessionStorage.removeItem('wt_token');
    sessionStorage.removeItem('wt_role');

    // Store depending on rememberMe preference
    const targetStorage = rememberMe ? localStorage : sessionStorage;
    targetStorage.setItem('wt_user', JSON.stringify(userData));
    targetStorage.setItem('wt_token', data.token);
    targetStorage.setItem('wt_role', data.role);

    return data;
  };

  const register = async (registerData) => {
    const data = await registerAPI(registerData);
    const userData = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      state: data.state
    };

    setUser(userData);
    setToken(data.token);
    setRole(data.role);

    localStorage.setItem('wt_user', JSON.stringify(userData));
    localStorage.setItem('wt_token', data.token);
    localStorage.setItem('wt_role', data.role);

    return data;
  };

  const logout = async () => {
    await logoutAPI();
    setUser(null);
    setToken(null);
    setRole(null);

    localStorage.removeItem('wt_user');
    localStorage.removeItem('wt_token');
    localStorage.removeItem('wt_role');

    sessionStorage.removeItem('wt_user');
    sessionStorage.removeItem('wt_token');
    sessionStorage.removeItem('wt_role');
  };

  const updateProfile = async (updatedFields) => {
    const res = await updateProfileAPI(updatedFields, token);
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    if (localStorage.getItem('wt_user')) {
      localStorage.setItem('wt_user', JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem('wt_user')) {
      sessionStorage.setItem('wt_user', JSON.stringify(updatedUser));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isInitializing,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
