import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResults } from '../utils/api';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-display text-white mb-2">Results</h1>
        <p className="text-neutral-400">
          View results from all closed polls
        </p>
      </div>

      {error ? (
        <div className="card bg-red-600/10 border-red-600/30 text-center animate-slide-down">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={loadResults} className="btn-secondary">
            Try Again
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="card text-center animate-slide-up">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-display text-white mb-2">No Results Yet</h3>
          <p className="text-neutral-400">
            There are no closed polls yet. Results will appear here once polls are closed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((poll, index) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
            const winner = sortedOptions[0];

            return (
              <div
                key={poll._id}
                className="card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-display text-white mb-2">{poll.title}</h3>
                    {poll.description && (
                      <p className="text-neutral-400 mb-4">{poll.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-neutral-500">
                      <span>Closed {new Date(poll.closedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Total votes: {totalVotes}</span>
                      <span>•</span>
                      <span>Created by {poll.createdBy.username}</span>
                    </div>
                  </div>
                  <span className="badge-closed">Closed</span>
                </div>

                {totalVotes > 0 && (
                  <div className="bg-gradient-to-r from-primary-600/20 to-primary-700/20 border border-primary-600/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-primary-400 font-semibold">Winner</div>
                        <div className="text-white font-bold">{winner.text}</div>
                        <div className="text-sm text-neutral-400">
                          {winner.votes} votes ({((winner.votes / totalVotes) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {sortedOptions.map((option, idx) => {
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    const isWinner = idx === 0 && totalVotes > 0;

                    return (
                      <div
                        key={option.id}
                        className={`relative overflow-hidden rounded-lg border-2 ${
                          isWinner
                            ? 'border-primary-600/50 bg-primary-600/5'
                            : 'border-neutral-700 bg-neutral-800'
                        }`}
                      >
                        <div
                          className={`absolute inset-0 transition-all duration-500 ${
                            isWinner ? 'bg-primary-600/20' : 'bg-neutral-700/30'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="relative p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`text-2xl font-bold ${
                              isWinner ? 'text-primary-500' : 'text-neutral-600'
                            }`}>
                              #{idx + 1}
                            </div>
                            <span className="text-white font-medium">{option.text}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-neutral-400 text-sm font-medium">
                              {percentage.toFixed(1)}%
                            </span>
                            <span className="text-white font-semibold min-w-[3rem] text-right">
                              {option.votes}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-700">
                  <button
                    onClick={() => navigate(`/poll/${poll._id}`)}
                    className="text-primary-500 hover:text-primary-400 font-medium text-sm flex items-center space-x-2 transition-colors"
                  >
                    <span>View full details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;