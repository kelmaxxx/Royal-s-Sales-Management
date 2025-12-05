import React, { useState, createContext, useContext } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username, password) => {
    // Mock authentication - check credentials
    if (username.toLowerCase() === 'admin' && password) {
      setCurrentUser({
        username: 'admin',
        name: 'John Admin',
        role: 'Admin',
        email: 'admin@royalsales.com',
      });
      setIsAuthenticated(true);
      return true;
    } else if (username.toLowerCase().startsWith('staff') && password) {
      setCurrentUser({
        username: username.toLowerCase(),
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'Staff',
        email: `${username.toLowerCase()}@royalsales.com`,
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
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
