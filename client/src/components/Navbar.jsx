import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="font-display text-xl text-white">VoteHub</span>
            </Link>

            {user && (
              <div className="hidden md:flex space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/')
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  Polls
                </Link>
                <Link
                  to="/results"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/results')
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  Results
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive('/admin')
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full ring-2 ring-primary-600"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-primary-600">
                    <span className="text-sm font-bold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">{user.username}</div>
                  {user.isAdmin && (
                    <div className="text-xs text-primary-400">Admin</div>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;