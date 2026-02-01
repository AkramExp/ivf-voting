import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPoll, submitVote, getVoters } from '../utils/api';

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [votersModalOpen, setVotersModalOpen] = useState(false);
  const [selectedOptionForModal, setSelectedOptionForModal] = useState(null);
  const [modalVoters, setModalVoters] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadPoll();
  }, [id]);

  const loadPoll = async () => {
    try {
      setLoading(true);
      const response = await getPoll(id);
      setPoll(response.data.poll);
      setUserVote(response.data.userVote);
      setSelectedOption(response.data.userVote);
      setError(null);
    } catch (error) {
      console.error('Failed to load poll:', error);
      setError(error.response?.data?.error || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;

    try {
      setSubmitting(true);
      const response = await submitVote(id, selectedOption);
      setPoll(response.data.poll);
      setUserVote(response.data.userVote);
      setError(null);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      setError(error.response?.data?.error || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVoters = async (optionId) => {
    const option = poll.options.find(opt => opt.id === optionId);
    setSelectedOptionForModal(option);
    setVotersModalOpen(true);

    try {
      setModalLoading(true);
      console.log("hello")
      const response = await getVoters(id, optionId);
      setModalVoters(response.data.voters);
    } catch (error) {
      console.error('Failed to load voters:', error);
      setError(error.response?.data?.error || 'Failed to load voters');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm font-light tracking-wide">Loading poll data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl shadow-red-500/10">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Poll</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all duration-200 font-medium shadow-lg"
            >
              Back to Polls
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const canVote = poll.isActive && user.inRequiredServer;
  const maxVotes = Math.max(...poll.options.map(opt => opt.votes), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-8 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center space-x-2 px-4 py-2 bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-xl hover:border-gray-700 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-gray-300 group-hover:text-white transition-colors font-medium">Back to Polls</span>
          </button>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${poll.isActive
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
              {poll.isActive ? 'Live' : 'Closed'}
            </span>
            <span className="px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full text-xs font-semibold text-gray-300">
              ID: {id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/30 overflow-hidden mb-8">
          {/* Poll Header */}
          <div className="p-8 border-b border-gray-800/50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 font-medium">IVF POLL</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 leading-tight tracking-tight">{poll.title}</h1>
                {poll.description && (
                  <p className="text-gray-400 text-lg leading-relaxed">{poll.description}</p>
                )}
              </div>
            </div>

            {/* Poll Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-800/50">
              {/* <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="text-white font-semibold">{poll.createdBy.username}</p>
                </div>
              </div> */}

              {/* <div className="h-8 w-px bg-gray-800/50"></div> */}

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created on</p>
                  <p className="text-white font-semibold">{new Date(poll.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-800/50"></div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Votes</p>
                  <p className="text-white font-semibold text-xl">{totalVotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Section */}
          <div className="p-8">
            {!canVote && poll.isActive && (
              <div className="mb-8 backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Restricted Access</h4>
                    <p className="text-yellow-300/80">
                      You must be a member of the required Discord server to vote in this poll.
                      Please contact the poll administrator for access.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!poll.isActive && (
              <div className="mb-8 backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Poll Closed</h4>
                    <p className="text-red-300/80">
                      This poll has been closed by the administrator. No further votes can be submitted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Voting Options</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white'>
                {poll.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  const isSelected = selectedOption === option.id;
                  const hasVoted = userVote === option.id;
                  const barWidth = totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-purple-500 to-pink-500',
                    'from-green-500 to-emerald-500',
                    'from-yellow-500 to-orange-500',
                    'from-indigo-500 to-blue-500',
                    'from-pink-500 to-rose-500'
                  ];
                  const colorClass = colors[index % colors.length];

                  return (
                    <div key={option.id}>
                      <div
                        onMouseEnter={() => setHoveredOption(option.id)}
                        onMouseLeave={() => setHoveredOption(null)}
                        onClick={() => canVote && poll.isActive && setSelectedOption(option.id)}
                        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${canVote && poll.isActive
                          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl'
                          : 'cursor-default'
                          } ${isSelected
                            ? `border-primary-500/50 bg-gradient-to-r ${colorClass}/5`
                            : 'border-gray-800/50 bg-gray-900/30'
                          }`}
                      >
                        {/* Background bar */}
                        <div
                          className="absolute inset-0 transition-all duration-700 ease-out"
                          style={{ width: `${barWidth}%` }}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${colorClass}/10`}></div>
                        </div>

                        {/* Option content */}
                        <div className="relative p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              {/* Selection indicator */}
                              <div className="relative">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
                                  ? `border-primary-500 bg-gradient-to-r ${colorClass} shadow-lg shadow-primary-500/30`
                                  : 'border-gray-600 bg-gray-800/50'
                                  }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                {canVote && poll.isActive && (
                                  <div className={`absolute -inset-3 rounded-full transition-opacity duration-300 ${hoveredOption === option.id ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    <div className="absolute inset-0 bg-primary-500/20 blur-md"></div>
                                  </div>
                                )}
                              </div>

                              {/* Option text */}
                              <div className="flex-1">
                                <span className="text-white text-lg font-medium">{option.text}</span>
                                {hasVoted && (
                                  <div className="inline-flex items-center ml-3 px-2 py-1 bg-primary-500/20 rounded-md">
                                    <svg className="w-3 h-3 text-primary-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-semibold text-primary-400">Your Vote</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Vote count and percentage */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white mb-1">{option.votes}</div>
                              <div className="text-sm font-semibold text-gray-400">{percentage.toFixed(1)}%</div>
                            </div>
                          </div>

                          {/* Percentage bar */}
                          <div className="mt-4 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-out`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>

                          {/* View Voters Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVoters(option.id);
                            }}
                            className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600 rounded-lg transition-all duration-200 text-gray-300 hover:text-white text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <span>View Voters ({option.votes})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vote Button */}
            {canVote && poll.isActive && (
              <div className="flex items-center justify-between pt-8 border-t border-gray-800/50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${selectedOption ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                    <p className="text-gray-400">
                      {userVote
                        ? 'You can change your vote anytime while the poll is active'
                        : 'Select an option above to cast your vote'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleVote}
                  disabled={!selectedOption || submitting}
                  className="relative group px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center space-x-2">
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{userVote ? 'Update Vote' : 'Submit Vote'}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Poll Activity</h3>
              <div className="px-2 py-1 bg-green-500/10 rounded text-xs font-medium text-green-400">
                {poll.isActive ? 'Active Now' : 'Ended'}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Votes per hour</span>
                <span className="text-white font-semibold">{Math.round(totalVotes / 24)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active voters</span>
                <span className="text-white font-semibold">{totalVotes}</span>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Your Status</h3>
              <div className={`px-2 py-1 rounded text-xs font-medium ${userVote ? 'bg-primary-500/10 text-primary-400' : 'bg-gray-800 text-gray-400'
                }`}>
                {userVote ? 'Voted' : 'Not Voted'}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Server access</span>
                <span className={`font-semibold ${user.inRequiredServer ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {user.inRequiredServer ? 'Granted' : 'Required'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Eligibility</span>
                <span className={`font-semibold ${canVote ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                  {canVote ? 'Eligible' : 'Restricted'}
                </span>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Poll Details</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Options</span>
                <span className="text-white font-semibold">{poll.options.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-white font-semibold">Ongoing</span>
              </div>
            </div>
          </div>
        </div> */}

        {error && (
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Voters Modal */}
      {votersModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Voters</h3>
                  {/* <p className="text-sm text-gray-400">
                    {selectedOptionForModal && `${selectedOptionForModal.text}`}
                  </p> */}
                </div>
              </div>
              <button
                onClick={() => {
                  setVotersModalOpen(false);
                  setModalVoters([]);
                  setSelectedOptionForModal(null);
                }}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-primary-400 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-400 font-medium">Loading voters...</p>
                </div>
              ) : modalVoters.length > 0 ? (
                <div className="space-y-3">
                  {modalVoters.map((voter, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-200">
                      {voter.avatar && (
                        <img
                          src={`https://cdn.discordapp.com/avatars/${voter.discordId}/${voter.avatar}.png`}
                          alt={voter.username}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48?text=User';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{voter.username}</p>
                        <p className="text-gray-500 text-xs">
                          Voted on {new Date(voter.votedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} at {new Date(voter.votedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-400 font-medium">No voters yet</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-800/50">
              <button
                onClick={() => {
                  setVotersModalOpen(false);
                  setModalVoters([]);
                  setSelectedOptionForModal(null);
                }}
                className="px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollDetail;