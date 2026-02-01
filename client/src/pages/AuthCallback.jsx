import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { handleDiscordCallback } from '../utils/api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 700;

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setStatus('error');
      setError('No authorization code received from Discord');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 10));
    }, 200);

    const authenticate = async (attempt = 1) => {
      try {
        setStatus('authenticating');

        const response = await handleDiscordCallback(code);

        clearInterval(progressInterval);
        setProgress(100);
        setStatus('success');

        // Commit auth immediately
        login(response.data.token, response.data.user);

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500);

      } catch (err) {
        console.error(`Auth attempt ${attempt} failed`, err);

        if (attempt < MAX_RETRIES) {
          setRetryCount(attempt);

          setTimeout(() => {
            authenticate(attempt + 1);
          }, RETRY_DELAY);

          return;
        }

        // Final failure only
        clearInterval(progressInterval);
        setStatus('error');
        setError(
          err.response?.data?.error ||
          'Authentication failed after multiple attempts. Please try again.'
        );

        setTimeout(() => navigate('/login'), 3500);
      }
    };

    authenticate(1);

    return () => clearInterval(progressInterval);
  }, [searchParams, navigate, login]);

  const getStatusMessage = () => {
    if (status === 'authenticating' && retryCount > 0) {
      return `Retrying authentication (${retryCount}/${MAX_RETRIES})...`;
    }

    switch (status) {
      case 'initializing':
        return 'Initializing authentication...';
      case 'authenticating':
        return 'Verifying Discord credentials...';
      case 'success':
        return 'Authentication successful! Redirecting...';
      default:
        return 'Processing...';
    }
  };

  const getStatusIcon = () => {
    if (status === 'error') {
      return (
        <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30 animate-scale-in">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }

    return (
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-lg animate-pulse"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center border border-primary-500/30">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-8 shadow-2xl shadow-black/30 text-center">

          {getStatusIcon()}

          <h2 className="text-2xl font-bold text-white mb-3">
            {getStatusMessage()}
          </h2>

          {status === 'authenticating' && (
            <div className="mb-6">
              <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-gray-400 mb-4">
            {error || 'Securely connecting your Discord account to VoteHub...'}
          </p>

          {error && (
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
