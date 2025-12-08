import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await onLogin(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Abstract Wave Design (55%) */}
      <div className="w-[55%] bg-gradient-to-br from-primary-dark via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Abstract Waves */}
        <div className="absolute inset-0">
          {/* Wave 1 */}
          <svg className="absolute bottom-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path
              fill="url(#gradient1)"
              d="M0,400 C240,500 480,300 720,400 C960,500 1200,300 1440,400 L1440,800 L0,800 Z"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0,400 C240,500 480,300 720,400 C960,500 1200,300 1440,400 L1440,800 L0,800 Z;
                  M0,350 C240,250 480,450 720,350 C960,250 1200,450 1440,350 L1440,800 L0,800 Z;
                  M0,400 C240,500 480,300 720,400 C960,500 1200,300 1440,400 L1440,800 L0,800 Z"
              />
            </path>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Wave 2 */}
          <svg className="absolute bottom-0 left-0 w-full h-full opacity-15" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path
              fill="url(#gradient2)"
              d="M0,500 C320,600 640,400 960,500 C1280,600 1440,400 1440,500 L1440,800 L0,800 Z"
            >
              <animate
                attributeName="d"
                dur="15s"
                repeatCount="indefinite"
                values="
                  M0,500 C320,600 640,400 960,500 C1280,600 1440,400 1440,500 L1440,800 L0,800 Z;
                  M0,450 C320,350 640,550 960,450 C1280,350 1440,550 1440,450 L1440,800 L0,800 Z;
                  M0,500 C320,600 640,400 960,500 C1280,600 1440,400 1440,500 L1440,800 L0,800 Z"
              />
            </path>
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Circles */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent-gold opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-96 h-96 bg-accent-gold opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-300 opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
{/* Content */}
        <div className="relative z-10 text-center px-12 max-w-3xl mx-auto">
          {/* Logo / Icon */}
          <div className="inline-flex items-center justify-center w-28 h-28 bg-accent-gold bg-opacity-90 backdrop-blur-lg rounded-3xl mb-8 shadow-2xl border border-accent-gold border-opacity-50">
            <Crown className="w-16 h-16 text-primary-dark drop-shadow-lg" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
            Royal's Sales <br />
            <span className="text-opacity-90">Management System</span>
          </h1>

          {/* Tagline - Option 1 */}
          <p className="text-xl md:text-2xl text-accent-gold font-medium mb-6 drop-shadow-md">
            Streamlining operations for efficiency and accuracy.
          </p>

          {/* Decorative Divider */}
          <div className="w-24 h-1 bg-white bg-opacity-40 mx-auto mb-8 rounded-full"></div>

          {/* Description - Option 1 (Replaces the generic stats) */}
          <p className="text-lg text-white text-opacity-90 leading-relaxed drop-shadow-sm">
            A centralized platform for managing product listings, sales transactions, 
            and essential business reports.
          </p>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 border-t-4 border-l-4 border-white opacity-20 rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 border-b-4 border-r-4 border-white opacity-20 rounded-br-3xl"></div>
      </div>

      {/* Right Side - Login Form (45%) */}
      <div className="w-[45%] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Sign In</h2>
              <p className="text-gray-500">Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-all pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-accent-gold border-gray-300 rounded focus:ring-accent-gold" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-accent-gold hover:text-yellow-600 font-medium">Forgot password?</a>
              </div>
               
              
              

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-dark to-slate-700 text-white py-3.5 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>




            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
