import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:4000/api/users/me', {
        withCredentials: true
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('User not authenticated');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', {
        email,
        password
      }, {
        withCredentials: true
      });
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/register', {
        name,
        username,
        email,
        password
      }, {
        withCredentials: true
      });
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:4000/api/users/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};