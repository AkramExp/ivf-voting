import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      label: 'Polls',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      path: '/results',
      label: 'Results',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  if (user?.isAdmin) {
    navItems.push({
      path: '/admin',
      label: 'Admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    });
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-gray-950/95 border-b border-gray-800/30 backdrop-blur-xl'
        : 'bg-gradient-to-b bg-gray-950/95 backdrop-blur-sm'
        }`}>
        {/* Animated border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              {/* <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center border border-gray-800/50 group-hover:border-primary-400/30 transition-all duration-300">
                  <div className="relative">
                    <svg className="w-5 h-5 text-primary-300 group-hover:text-primary-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div> */}
              <div className="relative">
                <span className="font-bold text-xl bg-gradient-to-r from-white via-primary-100 to-white bg-clip-text text-transparent tracking-tight">
                  IVF VoteHub
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-400/30 to-transparent group-hover:via-primary-400/50 transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group relative flex items-center space-x-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 ${isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-400/20 shadow-lg shadow-primary-500/5'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900/50 border border-transparent hover:border-gray-700/30'
                        }`}
                    >
                      {/* Active indicator */}
                      {isActive(item.path) && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/5 to-purple-400/5 rounded-xl"></div>
                        </>
                      )}

                      <span className={`relative transition-all duration-300 ${isActive(item.path)
                        ? 'text-primary-300'
                        : 'text-gray-500 group-hover:text-primary-300'
                        }`}>
                        {item.icon}
                      </span>

                      <span className="relative font-medium text-sm tracking-wide">
                        {item.label}
                      </span>

                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/0 to-purple-400/0 group-hover:from-primary-400/5 group-hover:to-purple-400/5 transition-all duration-300"></div>
                    </Link>
                  ))}
                </div>

                {/* User Profile & Logout */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-3 group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center ring-2 ring-gray-700/50 group-hover:ring-primary-400/30 transition-all duration-300">
                        <span className="text-sm font-bold text-gray-300">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-200">{user.username}</div>

                    </div>
                  </div>

                  <div className="h-5 w-px bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>

                  <button
                    onClick={handleLogout}
                    className="group relative flex items-center space-x-2 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-xl transition-all duration-300 border border-gray-800/50 hover:border-red-500/20"
                  >
                    <svg className="w-4 h-4 group-hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm font-medium">Logout</span>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 transition-all duration-300"></div>
                  </button>
                </div>
              </>
            ) : (
              // Show login button when user is not logged in
              <Link
                to="/login"
                className="group relative px-5 py-2.5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300 border border-gray-700/50 hover:border-primary-400/30 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <span className="relative">Login</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/0 to-purple-400/0 group-hover:from-primary-400/5 group-hover:to-purple-400/5 transition-all duration-300"></div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50 transition-all duration-300 border border-gray-700/50"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden animate-slide-down bg-gradient-to-b from-gray-950/95 to-gray-950 backdrop-blur-xl border-t border-gray-800/30">
            <div className="px-4 py-3">
              <div className="space-y-1 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500/10 to-purple-500/10 text-white border border-primary-400/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50 hover:border-gray-700/30 border border-transparent'
                      }`}
                  >
                    <span className={`transition-all duration-300 ${isActive(item.path)
                      ? 'text-primary-300'
                      : 'text-gray-500 group-hover:text-primary-300'
                      }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full"></div>
                    )}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-gray-800/30">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center ring-2 ring-gray-700/50">
                      <span className="text-sm font-bold text-gray-300">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">{user.username}</div>

                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-xl transition-all duration-300 border border-gray-800/50 hover:border-red-500/20 mt-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Add animation for slide down */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;