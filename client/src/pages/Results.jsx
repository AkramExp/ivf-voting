import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResults } from '../utils/api';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // recent, votes, title
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await getResults();
      setResults(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to load results:', error);
      setError(error.response?.data?.error || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getSortedAndFilteredResults = () => {
    let filtered = results.filter(poll =>
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          const votesA = a.options.reduce((sum, opt) => sum + opt.votes, 0);
          const votesB = b.options.reduce((sum, opt) => sum + opt.votes, 0);
          return votesB - votesA;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.closedAt) - new Date(a.closedAt);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm font-light tracking-wide">Loading voting results...</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedResults = getSortedAndFilteredResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-8 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Poll Results</h1>
              <p className="text-gray-400 text-lg">
                Insights and outcomes from closed community polls
              </p>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-600/20">
              <span className="text-sm font-semibold text-gray-300">
                {results.length} Polls Analyzed
              </span>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Polls</p>
                  <p className="text-2xl font-bold text-white">{results.length}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Votes</p>
                  <p className="text-2xl font-bold text-white">
                    {results.reduce((sum, poll) => sum + poll.options.reduce((s, opt) => s + opt.votes, 0), 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Most Votes</p>
                  <p className="text-2xl font-bold text-white">
                    {results.length > 0 ? Math.max(...results.map(poll =>
                      poll.options.reduce((sum, opt) => sum + opt.votes, 0)
                    )) : 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Turnout</p>
                  <p className="text-2xl font-bold text-white">
                    {results.length > 0 ?
                      Math.round(results.reduce((sum, poll) => sum + poll.options.reduce((s, opt) => s + opt.votes, 0), 0) / results.length)
                      : 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
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
                    placeholder="Search results by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="votes">Most Votes</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                <button
                  onClick={loadResults}
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

        {/* Content */}
        {error ? (
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Results</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={loadResults}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : sortedResults.length === 0 ? (
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Results Found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || sortBy !== 'recent'
                ? 'No results match your current search or filter criteria.'
                : 'There are no closed polls yet. Results will appear here once polls are completed.'}
            </p>
            {(searchTerm || sortBy !== 'recent') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('recent');
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
                Showing <span className="text-white font-semibold">{sortedResults.length}</span> of{' '}
                <span className="text-white font-semibold">{results.length}</span> results
              </div>
              <div className="text-sm text-gray-500">
                {sortBy === 'recent' ? 'Most recent first' :
                  sortBy === 'votes' ? 'Most votes first' :
                    'Alphabetical order'}
              </div>
            </div>

            <div className="space-y-8">
              {sortedResults.map((poll, index) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
                const winner = totalVotes > 0 ? sortedOptions[0] : null;
                const colors = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-green-500 to-emerald-500',
                  'from-yellow-500 to-orange-500'
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <div
                    key={poll._id}
                    className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 overflow-hidden animate-slide-up shadow-xl shadow-black/20 hover:shadow-gray-900/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Poll Header */}
                    <div className="p-8 border-b border-gray-800/50">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                              Closed
                            </span>
                            <span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs font-semibold rounded-full border border-gray-700/50">
                              {new Date(poll.closedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{poll.title}</h3>
                          {poll.description && (
                            <p className="text-gray-400 text-lg leading-relaxed">{poll.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Poll Metadata */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Created by</p>
                            <p className="text-white font-medium">{poll.createdBy.username}</p>
                          </div>
                        </div>

                        <div className="h-8 w-px bg-gray-800/50"></div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Votes</p>
                            <p className="text-white font-medium text-xl">{totalVotes}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Winner Highlight */}
                    {winner && totalVotes > 0 && (
                      <div className={`bg-gradient-to-r ${colorClass}/10 border-t-0 border-x-0 border-b border-gray-800/50 p-6`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20`}>
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-400 mb-1">DECIDED WINNER</div>
                            <div className="text-2xl font-bold text-white mb-2">{winner.text}</div>
                            <div className="text-gray-400">
                              <span className="font-semibold text-white">{winner.votes} votes</span>
                              {' '}•{' '}
                              <span>{((winner.votes / totalVotes) * 100).toFixed(1)}% majority</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Results Breakdown */}
                    <div className="p-8">
                      <h4 className="text-lg font-semibold text-white mb-6">Detailed Results</h4>
                      <div className="space-y-4">
                        {sortedOptions.map((option, idx) => {
                          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                          const isWinner = idx === 0 && totalVotes > 0;
                          const rankColors = ['bg-yellow-500/20 text-yellow-400', 'bg-gray-600/20 text-gray-400', 'bg-orange-500/20 text-orange-400'];

                          return (
                            <div
                              key={option.id}
                              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${isWinner
                                ? `border-primary-500/30 bg-gradient-to-r ${colorClass}/5`
                                : 'border-gray-800/50 bg-gray-900/30'
                                }`}
                            >
                              {/* Background percentage bar */}
                              <div
                                className="absolute inset-0 transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                              >
                                <div className={`absolute inset-0 ${isWinner
                                  ? `bg-gradient-to-r ${colorClass}/10`
                                  : 'bg-gray-700/10'
                                  }`}></div>
                              </div>

                              <div className="relative p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 flex-1">
                                    {/* Rank */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${idx < 3 ? rankColors[idx] : 'bg-gray-800/50 text-gray-400'
                                      }`}>
                                      #{idx + 1}
                                    </div>

                                    {/* Option text */}
                                    <div className="flex-1">
                                      <span className="text-white font-medium">{option.text}</span>
                                      {isWinner && (
                                        <div className="inline-flex items-center ml-3 px-2 py-1 bg-primary-500/20 rounded-md">
                                          <svg className="w-3 h-3 text-primary-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-xs font-semibold text-primary-400">Winner</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Votes and percentage */}
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-white mb-1">{option.votes}</div>
                                    <div className="text-sm font-semibold text-gray-400">{percentage.toFixed(1)}%</div>
                                  </div>
                                </div>

                                {/* Percentage bar */}
                                <div className="mt-4 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner
                                      ? `bg-gradient-to-r ${colorClass}`
                                      : 'bg-gray-600'
                                      }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* View Details Button */}
                      <div className="mt-8 pt-6 border-t border-gray-800/50">
                        <button
                          onClick={() => navigate(`/poll/${poll._id}`)}
                          className="group flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700/50 rounded-xl text-white hover:border-gray-600 transition-all duration-200 font-medium"
                        >
                          <span>View Full Poll Details</span>
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Info */}
            {results.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-800/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <span className="text-gray-600">Data compiled from closed polls • </span>
                    All results are final and cannot be changed
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Winner</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-xs text-gray-500">Runner-up</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Third place</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;