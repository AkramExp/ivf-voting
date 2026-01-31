import React, { useState } from 'react';
import { getDiscordAuthUrl } from '../utils/api';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-primary-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Main container */}
      <div className="max-w-md w-full relative z-10">
        {/* Logo and header */}
        <div className="text-center mb-12 animate-fade-in">
          {/* <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center border border-gray-800/50 shadow-2xl">
              <div className="relative">
                <svg className="w-14 h-14 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div> */}

          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent mb-3 tracking-tight">
            IVF VoteHub
          </h1>
          <p className="text-gray-400 text-lg font-light tracking-wide">
            Community voting platform
          </p>
          <div className="inline-flex items-center mt-2 space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time • Secure • Decentralized</span>
          </div>
        </div>

        {/* Login card */}
        <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-8 shadow-2xl shadow-black/30 animate-slide-up hover:shadow-gray-900/20 transition-all duration-300">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <div className="px-3 py-1 bg-primary-500/10 rounded-full">
                <span className="text-xs font-medium text-primary-400">V2.0</span>
              </div>
            </div>
            <p className="text-gray-400/80 text-sm leading-relaxed">
              Sign in with Discord to access polls, vote on community decisions, and track results in real-time.
            </p>
          </div>

          {/* Discord login button */}
          <button
            onClick={handleDiscordLogin}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={loading}
            className="relative group w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#5865F2] hover:to-[#3a45b3] text-white font-medium px-6 py-4 transition-all duration-300 shadow-lg shadow-[#5865F2]/20 hover:shadow-xl hover:shadow-[#5865F2]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated background effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${hover ? 'translate-x-[100%]' : ''}`}></div>

            <div className="relative flex items-center justify-center space-x-3">
              <div className={`transition-transform duration-300 ${hover ? 'scale-110' : ''}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <span className="text-base font-semibold">
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : 'Continue with Discord'}
              </span>
            </div>
          </button>

          {/* Security info */}
          <div className="mt-8 p-4 bg-gradient-to-br from-gray-900/60 to-black/40 rounded-xl border border-gray-800/30">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1 flex items-center">
                  Secure Authentication
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">Encrypted</span>
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Powered by Discord OAuth 2.0. We only access basic profile information and server membership to verify eligibility.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          {/* <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              <span>Real-time voting</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span>Server verified</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Anonymous results</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Secure audit trail</span>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-light tracking-wide animate-fade-in">
            <span className="text-gray-600">© 2026 IVF • </span>
            Built for IVF Voting
          </p>
          <div className="inline-flex items-center mt-3 space-x-4">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="text-xs text-gray-600">End-to-end encrypted</span>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Add these animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;