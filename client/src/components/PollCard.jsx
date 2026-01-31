import React from 'react';
import { useNavigate } from 'react-router-dom';

const PollCard = ({ poll }) => {
  const navigate = useNavigate();

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div
      onClick={() => navigate(`/poll/${poll._id}`)}
      className="card hover:border-primary-600 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/20 hover:-translate-y-1 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-display text-white mb-2 group-hover:text-primary-400 transition-colors">
            {poll.title}
          </h3>
          {poll.description && (
            <p className="text-neutral-400 text-sm line-clamp-2">{poll.description}</p>
          )}
        </div>
        <span className={poll.isActive ? 'badge-active' : 'badge-closed'}>
          {poll.isActive ? 'Active' : 'Closed'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {poll.options.slice(0, 3).map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <div key={option.id} className="flex items-center justify-between text-sm">
              <span className="text-neutral-300 truncate flex-1 mr-4">{option.text}</span>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-neutral-400 w-12 text-right">{option.votes}</span>
              </div>
            </div>
          );
        })}
        {poll.options.length > 3 && (
          <p className="text-xs text-neutral-500 text-center mt-2">
            +{poll.options.length - 3} more options
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-700">
        <span>Total votes: {totalVotes}</span>
        <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default PollCard;