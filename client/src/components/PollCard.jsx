import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PollCard = ({ poll }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const maxVotes = Math.max(...poll.options.map(opt => opt.votes), 1);
  const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500'];

  // Get top 3 options sorted by votes
  const topOptions = [...poll.options]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  return (
    <div
      onClick={() => navigate(`/poll/${poll._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Hover Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>

      <div className="relative backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6 transition-all duration-500 overflow-hidden hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${poll.isActive
            ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-lg shadow-green-500/10'
            : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-500/10'
            }`}>
            {poll.isActive ? 'Live' : 'Closed'}
          </div>
        </div>

        {/* Poll Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 font-medium">COMMUNITY POLL</div>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors">
            {poll.title}
          </h3>

          {poll.description && (
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {poll.description}
            </p>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-3 border border-gray-700/30">
            <div className="text-xs text-gray-500 mb-1">Total Votes</div>
            <div className="text-2xl font-bold text-white">{totalVotes}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-3 border border-gray-700/30">
            <div className="text-xs text-gray-500 mb-1">Options</div>
            <div className="text-2xl font-bold text-white">{poll.options.length}</div>
          </div>
        </div>

        {/* Top Options Visualization */}
        <div className="space-y-4 mb-6">
          <div className="text-sm font-semibold text-gray-300">Top Results</div>

          {topOptions.map((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const barWidth = totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold bg-gradient-to-r ${colors[index % colors.length]} text-white`}>
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-300 truncate flex-1">{option.text}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{percentage.toFixed(0)}%</div>
                </div>

                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{option.votes} votes</span>
                  <span>{percentage.toFixed(1)}% of total</span>
                </div>
              </div>
            );
          })}

          {poll.options.length > 3 && (
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400 border border-gray-700/50">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                +{poll.options.length - 3} more options
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-gray-500">
                {poll.isActive ? 'Voting open' : 'Voting closed'}
              </span>
            </div>

            <div className="flex items-center space-x-2 group/view">
              <span className="text-primary-400 font-medium group-hover/view:text-primary-300 transition-colors">
                View Details
              </span>
              <svg className="w-4 h-4 text-primary-400 group-hover/view:text-primary-300 group-hover/view:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-600">
            Created {new Date(poll.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Interactive Hover Elements */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}></div>

        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full blur transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}></div>
      </div>
    </div>
  );
};

export default PollCard;