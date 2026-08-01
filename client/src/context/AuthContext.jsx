import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const didInitRef = React.useRef(false);

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const response = await api.get('/auth/profile');
        setUser(response.data.data || response.data.user || response.data);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      loadUser();
    }
  }, [loadUser]);

  const setAuthData = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const payload = response.data.data || response.data;
    const newToken = payload.token;
    const userData = payload.user;
    setAuthData(newToken, userData);
    return userData;
  };

  const googleLogin = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    const payload = response.data.data || response.data;
    const newToken = payload.token;
    const userData = payload.user;
    setAuthData(newToken, userData);
    return userData;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const payload = response.data.data || response.data;
    const newToken = payload.token;
    const newUser = payload.user;
    setAuthData(newToken, newUser);
    return newUser;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const updateProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    const userData = response.data.data || response.data.user || response.data;
    setUser(userData);
    return userData;
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isRescuer = user?.role === 'rescuer';
  const isUser = user?.role === 'user';

  const value = {
    user,
    token,
    loading,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    isRescuer,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
