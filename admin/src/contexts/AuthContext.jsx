import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли сохраненная сессия
    const savedAdmin = localStorage.getItem('admin_user');
    const savedToken = localStorage.getItem('admin_token');
    
    if (savedAdmin && savedToken) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Проверка учетных данных
    if (email === 'admin@gmail.com' && password === 'liberty1230099') {
      const adminData = {
        email: 'admin@gmail.com',
        name: 'Администратор',
      };
      
      const token = 'admin_token_' + Date.now(); // Простой токен
      
      localStorage.setItem('admin_user', JSON.stringify(adminData));
      localStorage.setItem('admin_token', token);
      
      setAdmin(adminData);
      setIsAuthenticated(true);
      
      return { success: true };
    } else {
      return { success: false, error: 'Неверный email или пароль' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

