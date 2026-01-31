import React, { useState } from 'react';
import { getDiscordAuthUrl } from '../utils/api';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleDiscordLogin = async () => {
    try {
      setLoading(true);
      const response = await getDiscordAuthUrl();
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to get Discord auth URL:', error);
      alert('Failed to initiate Discord login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-display text-white mb-3">VoteHub</h1>
          <p className="text-neutral-400 text-lg">
            Community voting made simple
          </p>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-display text-white mb-4">Welcome</h2>
          <p className="text-neutral-400 mb-6">
            Sign in with Discord to participate in polls and see results. You must be a member of the required server to vote.
          </p>

          <button
            onClick={handleDiscordLogin}
            disabled={loading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold px-6 py-4 rounded-lg transition-all duration-200 shadow-lg shadow-[#5865F2]/30 hover:shadow-xl hover:shadow-[#5865F2]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>{loading ? 'Connecting...' : 'Continue with Discord'}</span>
          </button>

          <div className="mt-6 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-neutral-400">
                <p className="font-semibold text-neutral-300 mb-1">Authentication Required</p>
                <p>We use Discord OAuth to verify server membership. Your votes are tied to your Discord account.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-neutral-500 text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p>Secure authentication powered by Discord</p>
        </div>
      </div>
    </div>
  );
};

export default Login;