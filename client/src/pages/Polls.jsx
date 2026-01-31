import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getActivePolls } from '../utils/api';
import PollCard from '../components/PollCard';

const Polls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'voted', 'not-voted'

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      setLoading(true);
      const response = await getActivePolls();
      setPolls(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to load polls:', error);
      setError(error.response?.data?.error || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'voted') {
      return matchesSearch && poll.userVote;
    } else if (filter === 'not-voted') {
      return matchesSearch && !poll.userVote;
    }

    return matchesSearch;
  });

  if (!user.inRequiredServer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-8 shadow-2xl shadow-black/30">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                  <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">Server Access Required</h2>
            <p className="text-gray-400 text-center mb-6 leading-relaxed">
              You must be a member of the required Discord server to participate in community polls.
            </p>

            <div className="backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-yellow-400 font-medium mb-1">How to gain access:</p>
                  <ul className="text-yellow-300/80 text-sm space-y-1">
                    <li>• Join the required Discord server</li>
                    <li>• Log out and log back in to refresh permissions</li>
                    <li>• Contact an administrator if issues persist</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium shadow-lg"
            >
              Refresh Access Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-8 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Community Polls</h1>
              <p className="text-gray-400 text-lg">
                Vote on ongoing polls and shape community decisions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Live Access</span>
            </div>
          </div>

          {/* Stats Bar */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Polls</p>
                  <p className="text-2xl font-bold text-white">{polls.length}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Your Votes</p>
                  <p className="text-2xl font-bold text-white">
                    {polls.filter(p => p.userVote).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Votes</p>
                  <p className="text-2xl font-bold text-white">
                    {polls.filter(p => !p.userVote).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Votes</p>
                  <p className="text-2xl font-bold text-white">
                    {polls.reduce((sum, poll) => sum + (poll.totalVotes || 0), 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div> */}

          {/* Filters and Search */}
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search polls by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'all'
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('voted')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'voted'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Voted
                  </button>
                  <button
                    onClick={() => setFilter('not-voted')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'not-voted'
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Pending
                  </button>
                </div>

                <button
                  onClick={loadPolls}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-lg text-white hover:border-gray-600 transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-400 font-light tracking-wide">Loading community polls...</p>
          </div>
        ) : error ? (
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Polls</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={loadPolls}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Polls Found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || filter !== 'all'
                ? 'No polls match your current search or filter criteria. Try adjusting your filters.'
                : 'There are no active polls at the moment. New polls will appear here when created.'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium shadow-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-gray-400">
                Showing <span className="text-white font-semibold">{filteredPolls.length}</span> of{' '}
                <span className="text-white font-semibold">{polls.length}</span> polls
              </div>
              <div className="text-sm text-gray-500">
                Click on any poll to view details and vote
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll, index) => (
                <div
                  key={poll._id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PollCard poll={poll} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer Info */}
        {!loading && !error && polls.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Real-time updates</span>
              </div>
              <div className="text-sm text-gray-500 text-center">
                <span className="text-gray-600">Powered by Discord OAuth • </span>
                Votes are anonymous and secure
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-xs text-gray-500">Voted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Polls;