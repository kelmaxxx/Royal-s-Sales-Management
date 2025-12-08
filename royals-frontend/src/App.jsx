import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import AuthLayout from './components/AuthLayout';
import { authAPI } from './services/api';

// Create User Context
export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    // Initialize from localStorage
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist authentication state to localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [isAuthenticated, currentUser]);

  const handleLogin = async (username, password) => {
    try {
      // Call backend login API
      const response = await authAPI.login(username, password);
      
      // Store auth token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      // Set user data
      const user = {
        id: response.user.id,
        username: response.user.username,
        name: response.user.name,
        role: response.user.role,
        email: response.user.email,
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid username or password' 
      };
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, isAuthenticated }}>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <AuthLayout onLogout={handleLogout} currentUser={currentUser}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/sales" element={<SalesPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    {currentUser?.role === 'Admin' && (
                      <Route path="/users" element={<UsersPage />} />
                    )}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </AuthLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
