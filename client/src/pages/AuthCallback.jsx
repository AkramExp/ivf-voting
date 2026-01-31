import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { handleDiscordCallback } from '../utils/api';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("this is runingggg")
    const code = searchParams.get('code');

    if (!code) {
      setError('No authorization code received');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const authenticate = async () => {
      try {
        const response = await handleDiscordCallback(code);
        login(response.data.token, response.data.user);
        navigate('/');
      } catch (error) {
        console.error('Authentication failed:', error);
        setError(error.response?.data?.error || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    authenticate();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {error ? (
          <div className="animate-slide-down">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/30">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-white mb-2">Authentication Failed</h2>
            <p className="text-neutral-400 mb-4">{error}</p>
            <p className="text-sm text-neutral-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-display text-white mb-2">Authenticating...</h2>
            <p className="text-neutral-400">Please wait while we verify your Discord account</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;