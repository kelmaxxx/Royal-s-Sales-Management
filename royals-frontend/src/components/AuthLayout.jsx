import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FileText, Users, LogOut, Crown } from 'lucide-react';

const AuthLayout = ({ children, onLogout, currentUser }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/sales', label: 'Sales', icon: ShoppingCart },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/users', label: 'Users', icon: Users, adminOnly: true },
  ];

  const isActive = (path) => location.pathname === path;

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || currentUser?.role === 'Admin'
  );

  return (
    <div className="flex h-screen bg-background-light">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-dark text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-accent-gold p-2 rounded-lg">
              <Crown className="w-6 h-6 text-primary-dark" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Royal's Sales</h1>
              <p className="text-xs text-gray-400">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-slate-700 border-l-4 border-accent-gold text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center font-bold text-primary-dark">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="font-medium">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{currentUser?.role || 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 mt-2 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
