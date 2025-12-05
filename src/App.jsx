import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import AuthLayout from './components/AuthLayout';

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

  const handleLogin = (username, password) => {
    // Mock authentication - check credentials
    if (username.toLowerCase() === 'admin' && password) {
      const user = {
        username: 'admin',
        name: 'Kelmaxxx',
        role: 'Admin',
        email: 'admin@royalsales.com',
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } else if (username.toLowerCase().startsWith('staff') && password) {
      const user = {
        username: username.toLowerCase(),
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'Staff',
        email: `${username.toLowerCase()}@royalsales.com`,
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
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
