import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      // OAuth failed
      navigate('/login?error=' + errorParam);
      return;
    }

    if (token) {
      handleOAuthSuccess(token);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleOAuthSuccess = async (token) => {
    try {
      // Store the token
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);

      // Fetch user data using the token
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const user = response.data;

      // Set authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }));

      // Redirect directly to dashboard without showing loading screen
      window.location.replace('/dashboard');
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError('Failed to complete authentication');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
        {!error ? (
          <>
            <div className="mb-6">
              <div className="animate-spin mx-auto h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
