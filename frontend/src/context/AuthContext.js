
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('notestack_token');
      const savedUser = localStorage.getItem('notestack_user');

      if (token && savedUser) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('notestack_token');
          localStorage.removeItem('notestack_user');
          setUser(null);
        }
      }

      setLoading(false); 
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('notestack_token', token);
    localStorage.setItem('notestack_user', JSON.stringify(userData));

    setUser(userData);

    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await authAPI.register({ username, email, password });
    const { token, user: userData } = response.data;

  
    localStorage.setItem('notestack_token', token);
    localStorage.setItem('notestack_user', JSON.stringify(userData));

    setUser(userData);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('notestack_token');
    localStorage.removeItem('notestack_user');
    setUser(null);
  };

  const value = {
    user,          
    loading,        
    isLoggedIn: !!user, 
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
