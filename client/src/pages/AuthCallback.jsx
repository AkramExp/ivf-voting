import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { handleDiscordCallback } from '../utils/api';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("Authentication callback running...");
    const code = searchParams.get('code');

    if (!code) {
      setError('No authorization code received from Discord');
      setStatus('error');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    const authenticate = async () => {
      try {
        setStatus('authenticating');
        const response = await handleDiscordCallback(code);

        setProgress(100);
        setStatus('success');

        // Small delay for visual feedback
        setTimeout(() => {
          login(response.data.token, response.data.user);
          navigate('/');
        }, 1000);

      } catch (error) {
        console.error('Authentication failed:', error);
        clearInterval(progressInterval);
        setError(error.response?.data?.error || 'Authentication failed. Please try again.');
        setStatus('error');
        setTimeout(() => navigate('/login'), 3500);
      }
    };

    authenticate();

    return () => {
      clearInterval(progressInterval);
    };
  }, [searchParams, navigate, login]);

  const getStatusMessage = () => {
    switch (status) {
      case 'initializing':
        return 'Initializing authentication...';
      case 'authenticating':
        return 'Verifying Discord credentials...';
      case 'success':
        return 'Authentication successful! Redirecting...';
      case 'error':
        return 'Authentication failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'error':
        return (
          <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30 animate-scale-in">
            <svg className="w-10 h-10 text-green-400 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-lg animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center border border-primary-500/30">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-8 shadow-2xl shadow-black/30 text-center">

          {/* Status Icon */}
          {getStatusIcon()}

          {/* Discord Logo */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-[#5865F2] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#5865F2]/30">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 font-medium">Discord OAuth 2.0</p>
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-white mb-3">{getStatusMessage()}</h2>

          {/* Progress Bar (show only during authentication) */}
          {status === 'authenticating' && (
            <div className="mb-6">
              <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Receiving code...</span>
                <span>Verifying...</span>
                <span>Redirecting</span>
              </div>
            </div>
          )}

          {/* Detailed Message */}
          <div className="mb-6">
            <p className="text-gray-400 mb-4">
              {error ? error : 'Securely connecting your Discord account to VoteHub...'}
            </p>
            {!error && (
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>End-to-end encrypted connection</span>
              </div>
            )}
          </div>

          {/* Error Details */}
          {error && (
            <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm">
                  <p className="text-red-400 font-medium mb-1">Troubleshooting:</p>
                  <ul className="text-red-300/80 space-y-1">
                    <li>• Verify Discord server membership</li>
                    <li>• Check internet connection</li>
                    <li>• Try logging in again</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Loading Steps (during authentication) */}
          {!error && status === 'authenticating' && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Code received from Discord</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${progress >= 50 ? 'bg-gradient-to-r from-primary-500 to-purple-500' : 'bg-gray-800/50 border border-gray-700/50'
                  }`}>
                  {progress >= 50 && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${progress >= 50 ? 'text-gray-300' : 'text-gray-500'}`}>
                  Verifying server permissions
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${progress >= 100 ? 'bg-gradient-to-r from-primary-500 to-purple-500' : 'bg-gray-800/50 border border-gray-700/50'
                  }`}>
                  {progress >= 100 && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${progress >= 100 ? 'text-gray-300' : 'text-gray-500'}`}>
                  Creating secure session
                </span>
              </div>
            </div>
          )}

          {/* Redirect Countdown */}
          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <p className="text-sm text-gray-500">
              {error
                ? `Redirecting to login in ${Math.ceil(3500 - progress * 35) / 1000}s...`
                : status === 'success'
                  ? 'Redirecting to dashboard...'
                  : 'Please wait while we complete authentication'
              }
            </p>
          </div>

          {/* Manual Redirect Button for Errors */}
          {error && (
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium"
            >
              Go to Login
            </button>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure authentication in progress • Your data is protected</span>
          </div>
        </div>
      </div>

      {/* Add animation for floating effect */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;