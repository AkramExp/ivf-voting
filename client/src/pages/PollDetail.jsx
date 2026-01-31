import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPoll, submitVote } from '../utils/api';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-600/10 border-red-600/30 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const canVote = poll.isActive && user.inRequiredServer;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-neutral-400 hover:text-white mb-6 transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to polls</span>
      </button>

      <div className="card mb-6 animate-fade-in">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-display text-white mb-2">{poll.title}</h1>
            {poll.description && (
              <p className="text-neutral-400">{poll.description}</p>
            )}
          </div>
          <span className={poll.isActive ? 'badge-active' : 'badge-closed'}>
            {poll.isActive ? 'Active' : 'Closed'}
          </span>
        </div>

        <div className="bg-neutral-900/50 rounded-lg p-4 mb-6 border border-neutral-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-neutral-500">Created by:</span>
                <span className="text-white ml-2 font-medium">{poll.createdBy.username}</span>
              </div>
              <div className="h-4 w-px bg-neutral-700"></div>
              <div>
                <span className="text-neutral-500">Total votes:</span>
                <span className="text-white ml-2 font-medium">{totalVotes}</span>
              </div>
            </div>
            <div className="text-neutral-500">
              {new Date(poll.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {!canVote && (
          <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm">
                <p className="text-yellow-400 font-semibold mb-1">
                  {!poll.isActive ? 'Poll Closed' : 'Cannot Vote'}
                </p>
                <p className="text-yellow-300/80">
                  {!poll.isActive 
                    ? 'This poll has been closed by the administrator.'
                    : 'You must be a member of the required Discord server to vote.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = selectedOption === option.id;
            const hasVoted = userVote === option.id;

            return (
              <div
                key={option.id}
                onClick={() => canVote && setSelectedOption(option.id)}
                className={`relative overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                  canVote
                    ? isSelected
                      ? 'border-primary-600 bg-primary-600/10'
                      : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    : 'border-neutral-700 bg-neutral-800 cursor-default'
                }`}
              >
                <div
                  className="absolute inset-0 bg-primary-600/20 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-neutral-600'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white font-medium">{option.text}</span>
                    {hasVoted && (
                      <span className="badge bg-primary-600/20 text-primary-400 border-primary-600/30">
                        Your vote
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-neutral-400 text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-white font-semibold min-w-[3rem] text-right">
                      {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canVote && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              {userVote ? 'You can change your vote anytime before the poll closes' : 'Select an option to vote'}
            </p>
            <button
              onClick={handleVote}
              disabled={!selectedOption || submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : userVote ? 'Update Vote' : 'Submit Vote'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-600/10 border border-red-600/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDetail;