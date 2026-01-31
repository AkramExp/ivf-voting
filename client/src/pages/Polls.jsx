import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getActivePolls } from '../utils/api';
import PollCard from '../components/PollCard';

const Polls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (!user.inRequiredServer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-600/30">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-white mb-4">Server Access Required</h2>
            <p className="text-neutral-400 mb-6">
              You must be a member of the required Discord server to participate in polls. 
              Please join the server and then log in again.
            </p>
            <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
              <p className="text-sm text-neutral-500">
                If you believe this is an error, please contact the administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-display text-white mb-2">Active Polls</h1>
        <p className="text-neutral-400">
          Vote on ongoing polls. You can change your vote anytime before the poll closes.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="card bg-red-600/10 border-red-600/30 text-center animate-slide-down">
          <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={loadPolls} className="btn-secondary">
            Try Again
          </button>
        </div>
      ) : polls.length === 0 ? (
        <div className="card text-center animate-slide-up">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-display text-white mb-2">No Active Polls</h3>
          <p className="text-neutral-400">
            There are no active polls at the moment. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll, index) => (
            <div
              key={poll._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <PollCard poll={poll} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Polls;